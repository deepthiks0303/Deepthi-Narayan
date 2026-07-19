"""
Agent that connects to a local MCP tool server (server.py) over stdio,
gives its tools to Gemini via the Google Gen AI SDK, and runs a
function-calling loop until Gemini produces a final answer.

Setup:
    pip install -r requirements.txt
    Set GEMINI_API_KEY (see .env)

Run:
    python agent.py
"""

import asyncio
import os
from contextlib import AsyncExitStack

from dotenv import load_dotenv
from google import genai
from google.genai import types
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

MODEL = "gemini-flash-latest"  # currently points to gemini-3.5-flash

# Launches the MCP server (both tools) as a subprocess over stdio.
SERVER_CONFIGS = {
    "utility": StdioServerParameters(command="python", args=["server.py"]),
}


def _mcp_schema_to_gemini(schema: dict) -> dict:
    """Strip fields Gemini's function-declaration schema doesn't accept."""
    if not isinstance(schema, dict):
        return schema
    cleaned = {}
    for key, value in schema.items():
        if key in ("title", "additionalProperties", "$schema"):
            continue
        if key == "properties" and isinstance(value, dict):
            cleaned[key] = {k: _mcp_schema_to_gemini(v) for k, v in value.items()}
        elif isinstance(value, dict):
            cleaned[key] = _mcp_schema_to_gemini(value)
        else:
            cleaned[key] = value
    return cleaned


class Agent:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.tool_to_session: dict[str, ClientSession] = {}
        self.function_declarations: list[types.FunctionDeclaration] = []
        self._exit_stack = AsyncExitStack()

    async def connect(self):
        """Start the MCP server and collect its tool definitions."""
        for _name, params in SERVER_CONFIGS.items():
            read, write = await self._exit_stack.enter_async_context(stdio_client(params))
            session = await self._exit_stack.enter_async_context(ClientSession(read, write))
            await session.initialize()

            listing = await session.list_tools()
            for tool in listing.tools:
                self.tool_to_session[tool.name] = session
                self.function_declarations.append(
                    types.FunctionDeclaration(
                        name=tool.name,
                        description=tool.description or "",
                        parameters=_mcp_schema_to_gemini(tool.inputSchema),
                    )
                )

    async def run(self, user_message: str) -> str:
        """Run the function-calling loop until Gemini returns a final text answer."""
        tools = types.Tool(function_declarations=self.function_declarations)
        config = types.GenerateContentConfig(tools=[tools])

        contents = [types.Content(role="user", parts=[types.Part(text=user_message)])]

        while True:
            response = self.client.models.generate_content(
                model=MODEL,
                contents=contents,
                config=config,
            )

            candidate = response.candidates[0]
            contents.append(candidate.content)

            function_calls = [
                part.function_call for part in candidate.content.parts if part.function_call
            ]

            if not function_calls:
                return "".join(
                    part.text for part in candidate.content.parts if part.text
                )

            response_parts = []
            for call in function_calls:
                session = self.tool_to_session[call.name]
                result = await session.call_tool(call.name, dict(call.args))
                result_text = "".join(
                    block.text for block in result.content if hasattr(block, "text")
                )
                response_parts.append(
                    types.Part.from_function_response(
                        name=call.name,
                        response={"result": result_text},
                    )
                )
            contents.append(types.Content(role="user", parts=response_parts))

    async def close(self):
        await self._exit_stack.aclose()


async def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Set GEMINI_API_KEY in your environment (see .env).")

    agent = Agent(api_key)
    await agent.connect()
    try:
        print("MCP Agent ready. Ask a question (calculator + unit converter tools available).")
        print("Type 'exit' or 'quit' to stop.\n")
        while True:
            query = input("You: ").strip()
            if not query:
                continue
            if query.lower() in ("exit", "quit"):
                break
            answer = await agent.run(query)
            print(f"Agent: {answer}\n")
    finally:
        await agent.close()


if __name__ == "__main__":
    asyncio.run(main())
