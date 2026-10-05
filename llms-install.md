# Installing the Vibe Marketolog MCP server (for AI agents)

Vibe Marketolog is a **remote** MCP server. There is nothing to clone, build or run locally:
the agent connects to a hosted endpoint.

- Endpoint: `https://lk.vibemarketolog.ru/mcp`
- Transport: Streamable HTTP
- Auth: OAuth 2.1 (dynamic client registration, PKCE S256) **or** a personal API key as a Bearer token

## Option A — client with remote OAuth support (Claude, ChatGPT, Claude Code, Cursor)

Add a remote server with the URL above. The client opens the Vibe Marketolog sign-in page,
the user signs in and clicks “Allow”. No key is needed.

Claude Code:

```bash
claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp
```

Then run `/mcp` and choose **Authenticate**.

## Option B — API key in a header (Cline, Windsurf, scripts)

1. Ask the user to create a key at <https://lk.vibemarketolog.ru/agent> (section “API keys”).
   Never print the key back into the chat or commit it.
2. Add the server to the MCP settings file (in Cline: *MCP Servers → Configure → Remote Servers*
   or `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "vibemarketolog": {
      "type": "streamableHttp",
      "url": "https://lk.vibemarketolog.ru/mcp",
      "headers": {
        "Authorization": "Bearer <USER_API_KEY>"
      }
    }
  }
}
```

## Verify the connection

Call the tool `connection_health` (free). It returns the account, the key's daily spend limit,
the ruble balance and which integrations (Yandex Direct, Metrika, Bitrix24) are connected.
Then call `landing_guide` (free) before building a landing page — it returns the route and brief.

## Money

Paid tools state their price in the description and are charged from the user's ruble balance.
Each connection has a daily spend limit (2 500 ₽ by default), changeable at
<https://lk.vibemarketolog.ru/agent>. Ask the user before any paid step unless they named a budget.

## Optional: the Claude Code plugin from this repository

```text
/plugin marketplace add vibemarketologru/vibe-landing-kit
/plugin install vibe-landing@vibe-landing-kit
```

It adds 12 skills and the catalog of 31 design systems and 26 motion recipes; the MCP server
above is still the part that builds, checks and launches pages.
