import os
import random
import re
import json

# Removed Google imports
SDK_VERSION = 'v2' # Keeping variable to avoid breaking other logic if used loosely, though unnecessary.

class AICleaner:
    def __init__(self):
        # Local Ollama defaults
        self.base_url = os.environ.get("LLAMA_API_BASE", "http://localhost:11434/v1")
        self.api_key = os.environ.get("LLAMA_API_KEY", "ollama") # Dummy key for local
        self.model_name = "llama3.2:1b" # Minimal model for low RAM
        
        # Check if we can connect to Ollama
        self.enabled = False
        try:
            import requests
            # Simple check to see if Ollama is up
            requests.get(f"{self.base_url.replace('/v1', '')}", timeout=1) 
            self.enabled = True
        except:
            # If local query fails, check if we have a real cloud key
            if os.environ.get("LLAMA_API_KEY") and "gsk_" in os.environ.get("LLAMA_API_KEY"):
                self.enabled = True
                
        print(f"[AI] Initialized. Mode: {'REAL (Llama 3.1 Local/Cloud)' if self.enabled else 'SIMULATION (Ollama not found)'}")
        if self.enabled:
             print(f"[AI] Target: {self.base_url} | Model: {self.model_name}")

    def clean_record(self, record):
        """
        Takes a dictionary record and returns suggested fixes.
        """
        if self.enabled:
            return self._call_llm(record)
        else:
            return self._simulate_ai(record)

    def _simulate_ai(self, record):
        """
        Smart heuristics pretending to be AI for demo purposes.
        """
        suggestions = {}
        confidence = 0.0
        fixes = []

        # 1. Infer Industry if missing but company name has hints
        company = str(record.get('company_name', '')).lower()
        industry = str(record.get('industry', ''))
        
        if not industry or industry == 'nan' or industry == 'None':
            if 'tech' in company or 'software' in company or 'data' in company or 'io' in company:
                suggestions['suggested_industry'] = 'Technology'
                fixes.append('AI: Inferred Industry')
                confidence = 0.85
            elif 'health' in company or 'med' in company:
                suggestions['suggested_industry'] = 'Healthcare'
                fixes.append('AI: Inferred Industry')
                confidence = 0.9
            elif 'bank' in company or 'capital' in company:
                suggestions['suggested_industry'] = 'Financial Services'
                fixes.append('AI: Inferred Industry')
                confidence = 0.9
        
        # 2. Fix Email Typos (Advanced)
        email = str(record.get('email', ''))
        if '@' in email:
            user, domain = email.split('@')
            # Fix common domain typos that heuristics might miss or just catch here
            if domain in ['gmil.com', 'gmal.com', 'gnail.com']:
                suggestions['suggested_email'] = f"{user}@gmail.com"
                fixes.append("AI: Fixed Email Domain")
                confidence = 0.95
        
        # 3. Standardize Job Title
        title = str(record.get('job_title', '')).lower()
        if 'mgr' in title and 'manager' not in title:
             suggestions['suggested_job_title'] = title.replace('mgr', 'Manager').title()
             fixes.append("AI: Expanded Title")
        
        return suggestions, fixes, confidence

    def _call_llm(self, record):
        """
        Calls Llama 3.1 API to clean the record.
        """
        prompt = f"""
            You are a B2B Data Quality Expert. Analyze the following record and provide corrections.
            
            Record: {json.dumps(record)}
            
            Tasks:
            1. Correct the company name (e.g. standard case, remove legal entity types if messy).
            2. Infer the Industry based on company name (use standard sectors like Technology, Healthcare, Finance, Retail, Manufacturing).
            3. Fix email typos (e.g. gmil.com -> gmail.com).
            4. Standardize Job Title (e.g. 'Mgr' -> 'Manager').
            5. Format Phone Number (e.g. +1-XXX-XXX-XXXX format if possible).
            
            Output strictly JSON with keys: suggested_company, suggested_industry, suggested_email, suggested_job_title, suggested_phone.
            Only include keys where you have a high-confidence correction or inference. If the original is fine, do not include it or include it unchanged.
            Do not add markdown formatting like ```json.
            """

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model_name,
                "messages": [
                    {"role": "system", "content": "You are a helpful JSON data cleaning assistant. Output raw JSON only."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            }
            
            # Using requests to avoid extra dependencies
            import requests
            response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload, timeout=10)
            
            if response.status_code != 200:
                print(f"[AI ERROR] API Error {response.status_code}: {response.text}")
                return self._simulate_ai(record)
                
            data = response.json()
            content = data['choices'][0]['message']['content']
            
            # Basic cleanup
            text = content.replace('```json', '').replace('```', '').strip()
            
            # Robust JSON extraction for small models (1B) that talk too much
            try:
                import re
                # Pre-cleaning
                text = text.replace('```json', '').replace('```', '').strip()
                
                # Fix common LLM JSON mistakes
                text = text.replace('NaN', 'null') # Python to JSON
                text = text.replace('None', 'null') # Python to JSON
                
                # Regex to find JSON object
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    potential_json = json_match.group(0)
                    try:
                        clean_data = json.loads(potential_json)
                    except json.JSONDecodeError:
                        # If greedy match failed (multiple objects?), try strict first block?
                        # Fallback: Just try loading the raw text if regex failed logic
                         clean_data = json.loads(text)
                else:
                    clean_data = json.loads(text)
                    
            except Exception as e:
                print(f"[AI RAW] {content}") # Log original content
                print(f"[AI ERROR] JSON Parse Failed: {e}. Output was not valid JSON.")
                return self._simulate_ai(record)
            
            suggestions = {}
            fixes = []
            
            # Map back to our structure
            if 'suggested_company' in clean_data and clean_data['suggested_company'] != record.get('company_name'):
                suggestions['company_name'] = clean_data['suggested_company']
                fixes.append("AI: Fixed Company Name")
                
            if 'suggested_industry' in clean_data and clean_data['suggested_industry'] != record.get('industry'):
                suggestions['suggested_industry'] = clean_data['suggested_industry']
                fixes.append("AI: Inferred Industry")
                
            if 'suggested_email' in clean_data and clean_data['suggested_email'] != record.get('email'):
                suggestions['suggested_email'] = clean_data['suggested_email']
                fixes.append("AI: Fixed Email")
                
            if 'suggested_job_title' in clean_data and clean_data['suggested_job_title'] != record.get('job_title'):
                suggestions['job_title'] = clean_data['suggested_job_title']
                fixes.append("AI: Standardized Title")
                
            if 'suggested_phone' in clean_data and clean_data['suggested_phone'] != record.get('phone'):
                suggestions['suggested_phone'] = clean_data['suggested_phone']
                fixes.append("AI: Formatted Phone")
            
            return suggestions, fixes, 0.95

        except Exception as e:
            print(f"[AI ERROR] Model failed: {e}")
            return self._simulate_ai(record) # Fallback


    def chat(self, query, context):
        """
        Handles natural language queries about the data health.
        """
        if not self.enabled:
            return "I'm sorry, I'm currently running in simulation mode because Ollama was not detected. Please start Ollama to enable interactive data chat."

        prompt = f"""
        You are the 'Data QA Copilot' Assistant. You help users understand their data quality.
        
        CONTEXT (Current Dataset Stats):
        {context}
        
        USER QUESTION:
        {query}
        
        INSTRUCTIONS:
        1. Answer based on the CONTEXT provided.
        2. Be concise, professional, and helpful.
        3. If asked about missing files or specific errors, refer to the counts in the context.
        4. If you don't know the answer from the context, say you don't have that specific data point.
        5. Do not hallucinate numbers.
        """

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model_name,
                "messages": [
                    {"role": "system", "content": "You are a helpful Data Quality Assistant. Answer questions based on the provided data context."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
            
            import requests
            response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload, timeout=20)
            
            if response.status_code != 200:
                return f"Error connecting to AI: {response.text}"
                
            data = response.json()
            return data['choices'][0]['message']['content'].strip()

        except Exception as e:
            return f"Chat Error: {str(e)}"

    def identify_columns(self, df):
        """
        Uses AI to map messy or disguised column headers to our internal schema.
        Returns a mapping dict: { 'Original Name': 'Schema Name' }
        """
        if not self.enabled:
            return {}

        headers = list(df.columns)
        # Take a small sample of data for context (first 5 rows)
        sample = df.head(5).to_dict(orient='records')
        
        target_schema = ['company_name', 'person_name', 'email', 'website', 'country', 'phone', 'job_title', 'industry', 'size', 'linkedin_url']
        
        prompt = f"""
        You are a Data Architect. I have a CSV file with messy or disguised column headers. 
        Your task is to map these headers to our standard schema.
        
        KEY IDENTIFICATION RULES:
        - 'person_name': Look for 'People Name', 'Contact Name', 'Full Name', 'Member', or columns containing human-like names (e.g. "John Smith").
        - 'email': Look for 'X1', 'Contact', 'Direct' or any column containing '@' symbols.
        - 'phone': Look for 'Digits', 'Cell', 'Office' or columns containing numbers formatted as phone numbers.
        - 'company_name': Look for 'Org', 'Business', 'Firm' or columns with company suffixes like Inc, LLC, Ltd.
        - 'linkedin_url': Look for 'LinkedIn', 'Profile URL', 'Social' or columns containing 'linkedin.com' links.
        
        ORIGINAL HEADERS: {json.dumps(headers)}
        SAMPLE DATA: {json.dumps(sample)}
        
        TARGET SCHEMA (You MUST map to these exact keys if a match is found):
        {target_schema}
        
        INSTRUCTIONS:
        - Output strictly a JSON object where KEY is the Original Header and VALUE is the Schema Name.
        - Only include columns that clearly match a schema requirement. 
        - If a column is 'X1' but contains 'user@example.com', map 'X1' to 'email'.
        - Do not map columns to multiple schema keys.
        - If no clear match, ignore that column.
        - Do not include markdown formatting.
        """

        try:
            headers_api = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model_name,
                "messages": [
                    {"role": "system", "content": "You are a professional Data Discovery AI. You output raw JSON mapping objects only."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            }
            
            import requests
            response = requests.post(f"{self.base_url}/chat/completions", headers=headers_api, json=payload, timeout=15)
            
            if response.status_code != 200:
                print(f"[AI DISCOVERY ERROR] API Error: {response.text}")
                return {}
                
            data = response.json()
            content = data['choices'][0]['message']['content'].strip()
            
            # Basic cleanup
            text = content.replace('```json', '').replace('```', '').strip()
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                mapping = json.loads(json_match.group(0))
                # Validate mapping values are in target_schema
                valid_mapping = { k: v for k, v in mapping.items() if v in target_schema }
                print(f"[AI DISCOVERY] Identified Mapping: {valid_mapping}")
                return valid_mapping
            return {}

        except Exception as e:
            print(f"[AI DISCOVERY ERROR] {str(e)}")
            return {}

    def batch_clean(self, df):
        """
        Apply cleaning to a dataframe.
        """
        print("[AI] Starting batch analysis...")
        
        # New columns for AI content
        if 'ai_suggestions' not in df.columns:
            df['ai_suggestions'] = ''
        
        if 'change_history' not in df.columns:
            df['change_history'] = ''

        ai_calls_made = 0
        MAX_AI_CALLS = 5 # Limit to Avoid infinite wait on local CPU LLMs
        
        for idx, row in df.iterrows():
            # Only process rows with issues or low confidence to save tokens/time
            has_issues = row.get('has_issues', False)
            
            if has_issues:
                data = row.to_dict()
                
                # Intelligent throttle: Only use real AI for first N rows to prove capability
                # then switch to heuristics to keep the app responsive.
                if self.enabled and ai_calls_made < MAX_AI_CALLS:
                    suggestions, fixes, conf = self._call_llm(data)
                    ai_calls_made += 1
                else:
                    suggestions, fixes, conf = self._simulate_ai(data)
                
                if fixes:
                    # Apply suggestions to dataframe
                    for k, v in suggestions.items():
                        # Crucial: Check if column exists or create it if it's a 'suggested_' field
                        if k not in df.columns:
                            if k.startswith('suggested_'):
                                df[k] = df[k.replace('suggested_', '')] if k.replace('suggested_', '') in df.columns else ''
                            else:
                                continue # Skip if it's not a schema field and doesn't exist
                        
                        old_val = df.at[idx, k]
                        if str(old_val) != str(v):
                            df.at[idx, k] = v
                            # Record change
                            entry = {"field": k, "old": str(old_val), "new": str(v), "method": "AI"}
                            existing_history = df.at[idx, 'change_history']
                            import json
                            if not existing_history:
                                df.at[idx, 'change_history'] = json.dumps([entry])
                            else:
                                try:
                                    h = json.loads(existing_history)
                                    h.append(entry)
                                    df.at[idx, 'change_history'] = json.dumps(h)
                                except:
                                    df.at[idx, 'change_history'] = json.dumps([entry])
                    
                    # Log what AI did
                    fix_str = "; ".join(fixes)
                    existing = str(df.at[idx, 'corrections_applied'])
                    if existing and existing != 'nan':
                        df.at[idx, 'corrections_applied'] = existing + "; " + fix_str
                    else:
                        df.at[idx, 'corrections_applied'] = fix_str
                        
        print(f"[AI] Batch analysis complete. Real AI Calls: {ai_calls_made}")
        return df
    def compare_records(self, rec1, rec2):
        """
        Uses LLM to compare two records at a character level to find duplicates.
        Focuses on Company Name, Postal Code, and Company Email.
        """
        if not self.enabled:
            return False, "AI Disabled"

        prompt = f"""
        Analyze if the following two company records refer to the SAME physical business entity.
        Compare character patterns in names, postal codes, and emails.
        
        Record A: 
        - Company: {rec1.get('company_name')}
        - Email: {rec1.get('company_email') or rec1.get('email')}
        - Postal: {rec1.get('postal_code')}
        
        Record B:
        - Company: {rec2.get('company_name')}
        - Email: {rec2.get('company_email') or rec2.get('email')}
        - Postal: {rec2.get('postal_code')}
        
        Rules:
        1. Ignore minor typos or formatting differences (e.g. "Inc." vs "Inc").
        2. If postal codes match exactly but names are slightly different, they are likely the same.
        3. If emails are at the same domain and names are very similar, they are the same.
        
        Return ONLY a JSON object: {{"is_duplicate": true/false, "reason": "short explanation"}}
        """
        
        try:
            response = requests.post(
                self.api_base + "/chat/completions",
                json={
                    "model": "llama3.2:1b",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                    "response_format": { "type": "json_object" }
                },
                timeout=10
            )
            res_json = response.json()
            content = json.loads(res_json['choices'][0]['message']['content'])
            return content.get('is_duplicate', False), content.get('reason', '')
        except Exception as e:
            return False, f"Comparison Error: {str(e)}"
