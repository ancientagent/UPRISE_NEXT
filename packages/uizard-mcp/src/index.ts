#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const VERSION = '0.1.0';

const server = new McpServer({
  name: 'uizard-mcp',
  version: VERSION,
});

function getConfig() {
  const apiKey = process.env.UIZARD_API_KEY?.trim() ?? '';
  const baseUrl = (process.env.UIZARD_API_BASE_URL?.trim() || 'https://api.uizard.io').replace(/\/$/, '');

  return {
    apiKey,
    baseUrl,
    hasApiKey: apiKey.length > 0,
  };
}

function buildUrl(baseUrl: string, path: string, query: Record<string, string> | undefined): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

server.registerTool(
  'uizard_config',
  {
    title: 'Uizard Config',
    description: 'Returns Uizard MCP configuration status.',
    inputSchema: {},
  },
  async () => {
    const config = getConfig();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              server: 'uizard-mcp',
              version: VERSION,
              baseUrl: config.baseUrl,
              hasApiKey: config.hasApiKey,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  'uizard_request',
  {
    title: 'Uizard Request',
    description:
      'Sends an authenticated HTTP request to the configured Uizard API base URL. This is a generic bridge tool.',
    inputSchema: {
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET'),
      path: z.string().min(1),
      query: z.record(z.string()).optional(),
      body: z.unknown().optional(),
      headers: z.record(z.string()).optional(),
    },
  },
  async ({ method, path, query, body, headers }) => {
    const config = getConfig();

    if (!config.hasApiKey) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: 'UIZARD_API_KEY is not set. Configure it before using uizard_request.',
          },
        ],
      };
    }

    const url = buildUrl(config.baseUrl, path, query);

    const requestHeaders: Record<string, string> = {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: 'application/json',
      ...headers,
    };

    let payload: string | undefined;
    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: payload,
      });

      const contentType = response.headers.get('content-type') ?? '';
      const text = await response.text();

      let parsedBody: unknown = text;
      if (contentType.includes('application/json')) {
        try {
          parsedBody = JSON.parse(text);
        } catch {
          parsedBody = text;
        }
      }

      const result = {
        request: {
          method,
          url,
        },
        response: {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: parsedBody,
        },
      };

      return {
        isError: !response.ok,
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Request failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('uizard-mcp failed to start:', error);
  process.exit(1);
});
