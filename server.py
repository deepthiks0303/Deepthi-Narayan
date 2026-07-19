"""
MCP server with two tools:
  1. calculate       - evaluate a basic arithmetic expression
  2. convert_units    - convert a value between common units (length, weight, temperature)

Run standalone for testing:
    python server.py
"""

import ast
import operator

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("utility-server")

# ---------------------------------------------------------------------------
# Tool 1: calculator
# ---------------------------------------------------------------------------

_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
}


def _safe_eval(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in _OPS:
        return _OPS[type(node.op)](_safe_eval(node.left), _safe_eval(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _OPS:
        return _OPS[type(node.op)](_safe_eval(node.operand))
    raise ValueError("Unsupported expression")


@mcp.tool()
def calculate(expression: str) -> str:
    """Evaluate a basic arithmetic expression (+, -, *, /, **).

    Args:
        expression: A math expression, e.g. "15 * 7 + 3".
    """
    try:
        tree = ast.parse(expression, mode="eval").body
        result = _safe_eval(tree)
        return str(result)
    except Exception as exc:
        return f"Error evaluating expression: {exc}"


# ---------------------------------------------------------------------------
# Tool 2: unit converter
# ---------------------------------------------------------------------------

_LENGTH_TO_M = {"m": 1.0, "km": 1000.0, "cm": 0.01, "mm": 0.001, "mi": 1609.344, "ft": 0.3048, "in": 0.0254}
_WEIGHT_TO_KG = {"kg": 1.0, "g": 0.001, "lb": 0.453592, "oz": 0.0283495}


def _convert_temperature(value: float, from_unit: str, to_unit: str) -> float:
    from_unit, to_unit = from_unit.lower(), to_unit.lower()
    # Normalize to Celsius first
    if from_unit == "c":
        celsius = value
    elif from_unit == "f":
        celsius = (value - 32) * 5 / 9
    elif from_unit == "k":
        celsius = value - 273.15
    else:
        raise ValueError(f"Unknown temperature unit: {from_unit}")

    if to_unit == "c":
        return celsius
    elif to_unit == "f":
        return celsius * 9 / 5 + 32
    elif to_unit == "k":
        return celsius + 273.15
    else:
        raise ValueError(f"Unknown temperature unit: {to_unit}")


@mcp.tool()
def convert_units(value: float, from_unit: str, to_unit: str) -> str:
    """Convert a numeric value between units of length, weight, or temperature.

    Supported units:
      - Length: m, km, cm, mm, mi, ft, in
      - Weight: kg, g, lb, oz
      - Temperature: c, f, k

    Args:
        value: The numeric value to convert.
        from_unit: The unit to convert from (e.g. "km", "lb", "c").
        to_unit: The unit to convert to (e.g. "mi", "kg", "f").
    """
    f, t = from_unit.lower(), to_unit.lower()
    try:
        if f in _LENGTH_TO_M and t in _LENGTH_TO_M:
            meters = value * _LENGTH_TO_M[f]
            result = meters / _LENGTH_TO_M[t]
        elif f in _WEIGHT_TO_KG and t in _WEIGHT_TO_KG:
            kg = value * _WEIGHT_TO_KG[f]
            result = kg / _WEIGHT_TO_KG[t]
        elif f in ("c", "f", "k") and t in ("c", "f", "k"):
            result = _convert_temperature(value, f, t)
        else:
            return f"Error: cannot convert between '{from_unit}' and '{to_unit}' (unsupported or mismatched unit types)."
        return f"{value} {from_unit} = {round(result, 4)} {to_unit}"
    except Exception as exc:
        return f"Error converting units: {exc}"


if __name__ == "__main__":
    mcp.run(transport="stdio")
