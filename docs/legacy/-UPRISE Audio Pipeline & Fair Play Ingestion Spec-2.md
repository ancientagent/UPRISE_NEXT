# UPRISE Audio Pipeline & Fair Play Ingestion Spec

## Purpose
Define the technical pipeline that moves a song from Upload -> Worker Processing -> Fair Play Queue, while enforcing the Canon identity and governance constraints.

## Canon Identity & Capability Model
- A user is a Listener with an Artist Capability (Standard or Premium).
- **Standard Capability:** 1 Active Slot.
- **Premium Capability:** 3 Active Slots.
- No separate Artist Accounts or Labels.

## Scene Assignment (Canonical)
- Songs are assigned **only** to the Artist's Home Scene at upload.
- Home Scene = City + State + Genre (Community affiliation).
- The Scene launches the Uprise (broadcast); Radiyo receives it across tiers.

## File Reception & Validation

### Supported Formats
```
primary: ['mp3', 'wav', 'flac', 'm4a', 'aac']
secondary: ['ogg', 'wma', 'aiff']
rejected: ['midi', 'mod', 'tracker']

requirements:
  mp3: { minBitrate: 128, maxBitrate: 320, sampleRates: [44100, 48000] }
  wav: { minBitrate: 1411, maxBitrate: 2304, sampleRates: [44100, 48000, 96000] }
  flac: { compression: 'lossless', maxFileSize: '100MB' }
  m4a: { codec: 'AAC', minBitrate: 128, maxBitrate: 256 }
```

### File Size & Duration Limits
```
maxFileSize: 100MB
maxDuration: 10 minutes
minDuration: 30 seconds
```

### Content Validation
```
virusScanning:
  enabled: true
  engines: ['ClamAV', 'Windows Defender']
  quarantineOnDetection: true

audioIntegrity:
  corruptionDetection: true
  headerValidation: true
  playabilityTest: true
  silenceDetection: { maxSilence: 30 }

copyrightScreening:
  acousticFingerprinting: true
  metadataComparison: true
  databaseCheck: ['Gracenote', 'MusicBrainz']
  flagSuspiciousMatches: true
```

### Upload Security
```
uploadToken:
  algorithm: 'JWT'
  expiration: 3600
  singleUse: true

rateLimiting:
  uploadsPerHour: 10
  uploadsPerDay: 50
  concurrentUploads: 3

ipBlocking:
  suspiciousActivity: true
  knownMaliciousIPs: true
  geoBlocking: ['sanctioned_countries']
```

## Worker Processing Pipeline

### Processing Stages
```
1: FILE_RECEPTION
2: FORMAT_VALIDATION
3: AUDIO_ANALYSIS
4: METADATA_EXTRACTION
5: QUALITY_ENHANCEMENT
6: FORMAT_CONVERSION
7: STREAMING_OPTIMIZATION
8: STORAGE_PREPARATION
9: QUALITY_CONTROL
10: FINAL_APPROVAL
```

### Audio Analysis
```
technicalAnalysis:
  bitrate: AUTOMATIC_DETECTION
  sampleRate: AUTOMATIC_DETECTION
  channels: MONO_STEREO_DETECTION
  duration: PRECISE_CALCULATION
  fileSize: BYTE_ACCURATE
  codec: FORMAT_IDENTIFICATION

qualityAnalysis:
  dynamicRange: LUFS_MEASUREMENT
  peakLevels: TRUE_PEAK_DETECTION
  frequency: SPECTRUM_ANALYSIS
  distortion: THD_MEASUREMENT
  noiseFloor: SNR_CALCULATION
  clipping: DIGITAL_CLIPPING_DETECTION

contentAnalysis:
  silenceDetection: { leadingSilence: TRIM_RECOMMENDATION, trailingSilence: TRIM_RECOMMENDATION, internalSilence: GAP_DETECTION }
  energyAnalysis: { rms: AVERAGE_ENERGY_LEVEL, peak: MAXIMUM_ENERGY_LEVEL, energyVariation: DYNAMIC_RANGE_SCORE, fadeInOut: AUTOMATIC_DETECTION }
  tempoAnalysis: { bpm: BEAT_DETECTION, timeSignature: RHYTHM_ANALYSIS, key: MUSICAL_KEY_DETECTION, mood: EMOTIONAL_CONTENT_ANALYSIS }
```

### Quality Enhancement
```
noiseReduction:
  enabled: false
  threshold: -60
  artistOptIn: true

silenceTrimming:
  enabled: true
  leadingThreshold: 0.5
  trailingThreshold: 1.0
  preserveFades: true

levelOptimization:
  enabled: true
  targetLUFS: -14
  peakLimiting: -1.0
  preserveDynamics: true
```

### Format Optimization / Transcoding Targets
```
mp3:
  encoder: 'LAME'
  quality: 'V0'
  jointStereo: 'AUTO'
  reservoire: true

aac:
  encoder: 'FDK-AAC'
  bitrate: 256
  profile: 'AAC-LC'
  bandwidth: 'AUTO'

streaming:
  format: 'AAC'
  bitrates: [128, 192, 256]
  adaptiveBitrate: true
  segmentDuration: 6
```

## Metadata Extraction & Enrichment

### ID3 Tags (MP3)
```
v1: ['title', 'artist', 'album', 'year', 'genre', 'track']

v2: [
  'title', 'artist', 'album', 'year', 'genre', 'track',
  'albumArtist', 'composer', 'conductor', 'publisher',
  'copyright', 'encodedBy', 'originalArtist', 'remixer',
  'bpm', 'key', 'mood', 'contentGroup', 'subtitle'
]

customTags: PRESERVE_ALL
```

### Other Format Tags
```
flac: VORBIS_COMMENTS
m4a: APPLE_METADATA
wav: INFO_CHUNK
ogg: VORBIS_COMMENTS
```

### Album Artwork
```
extraction: AUTOMATIC
formats: ['JPEG', 'PNG']
maxResolution: 1400x1400
minResolution: 300x300
aspectRatio: SQUARE_PREFERRED
fallback: UPRISE_DEFAULT_ARTWORK
```

## Storage & Directory Structure (S3)

### Directory Pattern
```
pattern: /songs/{year}/{month}/{community_key}/{artist_id}/{song_id}/
example: /songs/2024/03/austin-texas-hip-hop/12345/67890/
```

### File Layout
```
original.{ext}
master.flac
stream_256.aac
stream_192.aac
stream_128.aac
preview_30s.mp3
waveform.json
artwork_{size}.jpg
metadata.json
```

## Fair Play Ingestion (Canonical)

### Activation Rules
- A song can be ACTIVE only if the user has an available Capability slot.
- When a song is set to ACTIVE, ingestion starts automatically.

### Ingestion Phases
1. **Phase 1: Time-Based Rotation**
   - Newly ACTIVE songs enter a time-based rotation window.
   - Exposure is guaranteed without engagement weighting.

2. **Phase 2: Engagement-Based Rotation**
   - After Phase 1 completes, songs move into engagement-based rotation.
   - Engagement is recorded, not interpreted by the system.

### Prohibited Logic
- No submission queues.
- No algorithmic gatekeeping for ingestion.
- No alternate tier limits beyond Standard (1) and Premium (3) Active Slots.

## End-to-End Flow Summary
1. Upload -> Validate format, size, duration, and integrity.
2. Worker processing -> Analyze audio, extract metadata, transcode, normalize.
3. Store -> Write to S3 directory layout, generate stream/preview/artwork files.
4. Activate -> Song set ACTIVE by Listener with Artist Capability (within slot limits).
5. Ingest -> Automatic Fair Play Phase 1, then Phase 2.
6. Broadcast -> Song remains tied to Artist's Home Scene (City + State + Genre).
