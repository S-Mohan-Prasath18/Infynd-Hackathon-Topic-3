import os
import requests

# Setup key
key = os.environ.get("LLAMA_API_KEY")
if not key:
    try:
        with open("run.bat", "r") as f:
            for line in f:
                if "set LLAMA_API_KEY=" in line:
                    key = line.strip().split("=")[1].strip()
                    break
    except:
        pass

if not key or "..." in key:
    with open("models_list.txt", "w") as f:
        f.write("ERROR: No valid API Key found in run.bat or env.")
    print("No Key found.")
    exit(1)

print(f"Key found: {key[:5]}...")

base_url = "https://api.groq.com/openai/v1"

# Simple test
try:
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": "llama-3.1-70b-versatile",
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 10
    }
    resp = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload)
    if resp.status_code == 200:
        print("Success: API Connected to Llama 3.1")
        with open("models_list.txt", "w") as f:
            f.write("Success: Connected to Llama 3.1")
    else:
        print(f"Failed: {resp.text}")
        with open("models_list.txt", "w") as f:
            f.write(f"Error: {resp.status_code} - {resp.text}")

except Exception as e:
    print(f"Error: {e}")

