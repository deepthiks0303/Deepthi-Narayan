from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers

    Args:
        a: First number
        b: Second number

    Returns:
        Sum of a and b
    """
    return a + b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers

    Args:
        a: First number
        b: Second number

    Returns:
        Product of a and b
    """
    return a * b

@mcp.tool()
def subtract(a: int, b: int) -> int:
    """Subtract two numbers

    Args:
        a: First number
        b: Second number to subtract

    Returns:
        Difference (a - b)
    """
    return a - b

@mcp.tool()
def divide(a: int, b: int) -> float:
    """Divide two numbers

    Args:
        a: Dividend
        b: Divisor (must not be zero)

    Returns:
        Result of a / b
    """
    if b == 0:
        return float('inf')
    return a / b

@mcp.tool()
def power(a: int, b: int) -> int:
    """Raise a number to a power

    Args:
        a: Base number
        b: Exponent

    Returns:
        Result of a ** b
    """
    return a ** b

if __name__ == "__main__":
    print("🧮 Starting Math Server on Stdio transport...")
    print("📊 Available tools: add, multiply, subtract, divide, power")
    mcp.run(transport="stdio")
