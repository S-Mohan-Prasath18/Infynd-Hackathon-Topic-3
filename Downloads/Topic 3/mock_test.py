import requests
import os

# Create dummy CSV
with open("test_mock.csv", "w") as f:
    f.write("company_name,email\nGoogle,test@gmil.com")

url = "http://localhost:5000/api/analyze"
files = {'file': open('test_mock.csv', 'rb')}

try:
    print("Sending request...")
    r = requests.post(url, files=files)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:200]}...")
except Exception as e:
    print(f"Failed: {e}")
