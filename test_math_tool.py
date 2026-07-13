import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    params = StdioServerParameters(
        command="python",
        args=["mathserver.py"],
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = await session.list_tools()
            print("Tools available:", [t.name for t in tools.tools])

            add_result = await session.call_tool("add", {"a": 3, "b": 5})
            print("add(3, 5) =", add_result.content[0].text)

            mul_result = await session.call_tool("multiply", {"a": 8, "b": 12})
            print("multiply(8, 12) =", mul_result.content[0].text)

asyncio.run(main())
