# MCP Agent — Calculator + Unit Converter

A minimal agent built with the **MCP Python SDK**. One MCP server exposes two
tools; the agent connects to it and lets Gemini (via the Google Gen AI SDK)
call them.

## Files
- `server.py` — MCP server (built with `FastMCP`) exposing two tools:
  - `calculate(expression)` — evaluates a basic arithmetic expression
  - `convert_units(value, from_unit, to_unit)` — converts length, weight, or
    temperature between common units (m/km/cm/mm/mi/ft/in, kg/g/lb/oz, c/f/k)
- `agent.py` — client agent: launches `server.py` over stdio, registers its
  tools with Gemini, and runs the function-calling loop
- `.env` — contains `GEMINI_API_KEY` (already filled in with the key you gave me)
- `requirements.txt` — dependencies

## Setup
```bash
cd mcp_agent
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
```

## Run
```bash
python agent.py
```

This starts `server.py` as a subprocess, sends a sample question
("What is 15 * 7 + 3, and convert 10 km to miles?") to Claude, and prints
the final answer after Claude calls whichever tools it needs.

You can also run the server by itself to sanity-check it:
```bash
python server.py
```

## Customizing
- Change the `query` variable at the bottom of `agent.py` to ask anything else.
- Add more tools to `server.py` with `@mcp.tool()` — no other changes needed,
  the agent picks up every tool the server exposes automatically.
- Add a second server by adding another entry to `SERVER_CONFIGS` in `agent.py`.

## Security note
Your API key is stored in `.env`, which is excluded from version control via
`.gitignore`. Don't commit or share this file — treat the key like a password.
