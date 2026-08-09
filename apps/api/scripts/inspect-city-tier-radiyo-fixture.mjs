#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCityTierRadiyoFixturePlan } from './city-tier-radiyo-fixture-plan.mjs';

const SUPPORTED_EXTENSIONS = new Set(['.aac', '.flac', '.m4a', '.mp3', '.ogg', '.opus', '.wav']);

function usage() {
  return [
    'Usage:',
    '  node scripts/inspect-city-tier-radiyo-fixture.mjs (--audio-dir <path> | --inventory <tracks.json>) --city <city> --state <state> --music-community <community> [--source-group-depth <n>] [--start-date YYYY-MM-DD] [--output <manifest.json>] [--ffprobe <path>]',
    '',
    'This command reads local audio metadata and writes only an optional JSON manifest.',
    'It never copies audio, connects to Prisma, calls an API, or starts a worker.',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--') {
      continue;
    }
    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    options[key] = value;
    index += 1;
  }
  return options;
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function listAudioFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listAudioFiles(path));
      continue;
    }
    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(path);
    }
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function probeAudio(filePath, ffprobe, sourceKey = null) {
  const output = execFileSync(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration,format_name',
    '-of', 'json',
    filePath,
  ], { encoding: 'utf8' });
  const parsed = JSON.parse(output);
  const durationSeconds = Number(parsed?.format?.duration);
  if (!Number.isFinite(durationSeconds)) {
    throw new Error('ffprobe did not return a numeric duration');
  }
  return {
    fileName: filePath.split(/[\\/]/).pop(),
    path: filePath,
    durationSeconds,
    format: parsed?.format?.format_name ?? null,
    sha256: createHash('sha256').update(readFileSync(filePath)).digest('hex'),
    sourceKey,
  };
}

function sourceKeyForPath(audioDirectory, filePath, groupDepth) {
  if (!groupDepth) {
    return null;
  }
  const segments = relative(audioDirectory, filePath).split(sep).filter(Boolean);
  return segments.slice(0, groupDepth).join('/');
}

function readInventory(inventoryPath) {
  // PowerShell's Windows UTF-8 output can include a BOM. Accept it so a
  // read-only Windows inventory remains portable to the WSL planner.
  const parsed = JSON.parse(readFileSync(inventoryPath, 'utf8').replace(/^\uFEFF/, ''));
  const tracks = Array.isArray(parsed) ? parsed : parsed?.tracks;
  if (!Array.isArray(tracks)) {
    throw new Error('--inventory must contain a JSON array or an object with a tracks array');
  }
  return tracks;
}

function writeManifest(outputPath, manifest) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  for (const required of ['city', 'state', 'music-community']) {
    if (!options[required]) {
      throw new Error(`--${required} is required\n\n${usage()}`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(options['start-date'] ?? todayUtc())) {
    throw new Error('--start-date must use YYYY-MM-DD');
  }

  if (!options['audio-dir'] && !options.inventory) {
    throw new Error('Provide either --audio-dir or --inventory');
  }
  if (options['audio-dir'] && options.inventory) {
    throw new Error('Use either --audio-dir or --inventory, not both');
  }
  const groupDepth = options['source-group-depth'] === undefined ? 0 : Number(options['source-group-depth']);
  if (!Number.isInteger(groupDepth) || groupDepth < 0) {
    throw new Error('--source-group-depth must be a non-negative integer');
  }

  let tracks = [];
  const probeFailures = [];
  if (options.inventory) {
    tracks = readInventory(resolve(options.inventory));
  } else {
    const audioDirectory = resolve(options['audio-dir']);
    if (!existsSync(audioDirectory)) {
      throw new Error(`Audio directory does not exist: ${audioDirectory}`);
    }
    const audioPaths = listAudioFiles(audioDirectory);
    if (audioPaths.length === 0) {
    const result = {
      manifestVersion: 1,
      mode: 'read-only-local-preflight',
      readiness: { readyForStaging: false },
      safety: { audioCopiedIntoGit: false, databaseWrites: false, providerUploads: false },
      nextStep: `No supported hydrated audio files were found under ${audioDirectory}. Make the source files available locally, then rerun this command.`,
    };
    if (options.output) {
      writeManifest(resolve(options.output), result);
    }
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = 2;
      return;
    }

    const ffprobe = options.ffprobe ?? 'ffprobe';
    for (const path of audioPaths) {
      try {
        tracks.push(probeAudio(path, ffprobe, sourceKeyForPath(audioDirectory, path, groupDepth)));
      } catch (error) {
        probeFailures.push({ path, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  const manifest = buildCityTierRadiyoFixturePlan({
    city: options.city,
    state: options.state,
    musicCommunity: options['music-community'],
    startDate: options['start-date'] ?? todayUtc(),
    tracks,
  });
  manifest.inventory.probeFailures = probeFailures;
  if (options.output) {
    writeManifest(resolve(options.output), manifest);
  }
  console.log(JSON.stringify(manifest, null, 2));
  if (!manifest.readiness.readyForStaging || probeFailures.length > 0) {
    process.exitCode = 2;
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
