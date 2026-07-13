# MCP Server - Google Gemini Edition

A Model Context Protocol (MCP) implementation powered by **Google Gemini AI**.

## 🎯 Features

- **Math Server**: Advanced arithmetic operations (add, multiply, subtract, divide, power)
- **Weather Server**: Real-time weather data from Open-Meteo API (free, no API key needed)
- **Gemini AI Agent**: Intelligent agent powered by Google's Gemini API
- **Multiple Transport Options**: Stdio and HTTP protocols
- **Zero Setup**: API key already configured!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ~/Desktop/Deepthi-Narayan
python3 -m pip install --break-system-packages -r requirements.txt
```

### 2. Set API Key (Already Configured in .env)
The file `.env` already contains your Google Gemini API key, so no setup needed!

To manually set it (optional):
```bash
export GOOGLE_API_KEY='your_google_api_key_here'
```

### 3. Run the Servers

**Terminal 1 - Start Math Server:**
```bash
cd ~/Desktop/Deepthi-Narayan && python3 mathserver.py
```

**Terminal 2 - Start Weather Server:**
```bash
cd ~/Desktop/Deepthi-Narayan && python3 weather.py
```

**Terminal 3 - Run AI Agent:**
```bash
cd ~/Desktop/Deepthi-Narayan && python3 client.py
```

## 📋 Available Commands

### Run Demo
```bash
python3 main.py
```

### Start Math Server
```bash
python3 mathserver.py
```
**Tools:** add, multiply, subtract, divide, power

### Start Weather Server
```bash
python3 weather.py
```
**Tools:** get_weather (for any city/location)

### Run AI Agent (requires both servers)
```bash
python3 client.py
```

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│        Google Gemini AI Agent (client.py)           │
│   Powered by langchain-google-genai & LangGraph    │
└────────────┬──────────────────────┬─────────────────┘
             │                      │
      ┌──────▼────────┐      ┌──────▼──────────┐
      │ Math Server   │      │ Weather Server  │
      │  (Stdio)      │      │    (HTTP)       │
      └───────────────┘      └─────────────────┘
```

## 📚 Technology Stack

| Component | Technology |
|-----------|------------|
| **LLM** | Google Gemini API (gemini-1.5-flash model) |
| **Protocol** | Model Context Protocol (MCP) |
| **Framework** | FastMCP |
| **Orchestration** | LangChain + LangGraph |
| **Language** | Python 3.13+ |
| **Weather Data** | Open-Meteo API (free) |

## 🔑 API Key Info

- **Service**: Google Generative AI (Gemini)
- **Model**: `gemini-1.5-flash` (Latest free model)
- **Status**: ✅ Configured in `.env`
- **Cost**: Free tier with usage limits
- **Alternative Models**: `gemini-1.5-pro`, `gemini-1.0-pro`

## 💡 Example Queries

The Gemini-powered agent can handle:
- "What is (3 + 5) × 12?"
- "What is the weather in California?"
- "Calculate 100 + 250 and tell me the result"
- "What's the weather in Tokyo?"
- "Multiply 15 by 8"
- "Divide 144 by 12"
- "Raise 2 to the power of 10"

## 🔧 Troubleshooting

### Error: "GOOGLE_API_KEY environment variable not set"
The `.env` file should automatically load. If not:
```bash
export GOOGLE_API_KEY='your_google_api_key_here'
python3 client.py
```

### Error: "Connection refused" when running client.py
Make sure both servers are running in separate terminals:
```bash
# Terminal 1
python3 mathserver.py

# Terminal 2
python3 weather.py

# Terminal 3
python3 client.py
```

### Error: "ModuleNotFoundError"
Reinstall dependencies:
```bash
pip install --break-system-packages -r requirements.txt
```

## 📖 How It Works

1. **User Query** → "What is (3 + 5) × 12?"
2. **Gemini AI** analyzes the query and identifies math tools needed
3. **Math Server** executes: add(3, 5) → 8
4. **Math Server** executes: multiply(8, 12) → 96
5. **Gemini AI** formats and returns: "The answer is 96"

## 🌐 Key Features

✅ **No OpenAI dependency** - Uses Google Gemini  
✅ **Multi-server support** - Math + Weather tools  
✅ **AI-powered routing** - Intelligent tool selection  
✅ **Real-time weather** - From Open-Meteo (free)  
✅ **Async execution** - Non-blocking operations  
✅ **Easy to extend** - Add more tools easily  

## 📝 License

MIT License

---

**Made with ❤️ using Google Gemini API**
