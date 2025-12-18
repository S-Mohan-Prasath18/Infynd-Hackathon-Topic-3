import pandas as pd
import re

def apply_corrections(df):
    """
    Suggests fixes for emails, countries, etc.
    """
    # Initialize suggestion columns safely
    if 'email' in df.columns:
        df['suggested_email'] = df['email']
        df['email_confidence'] = 0.0
    
    if 'country' in df.columns:
        df['suggested_country'] = df['country']
        df['country_confidence'] = 0.0
        
    df['corrections_applied'] = '' 
    df['change_history'] = '' 
    
    import json
    def record_change(idx, field, old, new):
        if str(old) == str(new): return
        entry = {"field": field, "old": str(old), "new": str(new)}
        existing = df.at[idx, 'change_history']
        if not existing:
            df.at[idx, 'change_history'] = json.dumps([entry])
        else:
            try:
                history = json.loads(existing)
                history.append(entry)
                df.at[idx, 'change_history'] = json.dumps(history)
            except:
                df.at[idx, 'change_history'] = json.dumps([entry])

    # 1. Email Domain Corrections
    if 'email' in df.columns:
        typo_map = {
            'gmial.com': 'gmail.com',
            'gmaill.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'outloo.com': 'outlook.com'
        }
        
        def fix_email(email):
            if pd.isna(email) or '@' not in str(email):
                return email, 0.0, None
            parts = str(email).split('@', 1)
            if len(parts) < 2: return email, 0.0, None
            user, domain = parts
            correction = None
            confidence = 0.0
            if domain in typo_map:
                domain = typo_map[domain]
                correction = 'Email Domain Correction'
                confidence = 0.95
            return f"{user}@{domain}", confidence, correction

        for idx, row in df.iterrows():
            new_email, conf, corr = fix_email(row['email'])
            if corr:
                old_val = df.at[idx, 'email']
                df.at[idx, 'suggested_email'] = new_email
                df.at[idx, 'email_confidence'] = conf
                record_change(idx, 'email', old_val, new_email)
                current_corrections = str(df.at[idx, 'corrections_applied'])
                df.at[idx, 'corrections_applied'] = (current_corrections + ';' + corr) if current_corrections else corr

    # 2. Country Standardization
    if 'country' in df.columns:
        country_map = {
            'USA': 'United States', 'US': 'United States', 'U.S.': 'United States', 'U.S.A.': 'United States',
            'UK': 'United Kingdom', 'U.K.': 'United Kingdom', 'England': 'United Kingdom'
        }
        
        def fix_country(country):
            if pd.isna(country): return country, 0.0, None
            c_str = str(country).strip()
            if c_str in country_map:
                return country_map[c_str], 1.0, 'Country Standardization'
            return c_str, 0.0, None

        for idx, row in df.iterrows():
            new_country, conf, corr = fix_country(row['country'])
            if corr:
                old_val = df.at[idx, 'country']
                df.at[idx, 'suggested_country'] = new_country
                df.at[idx, 'country_confidence'] = conf
                record_change(idx, 'country', old_val, new_country)
                current_corrections = str(df.at[idx, 'corrections_applied'])
                df.at[idx, 'corrections_applied'] = (current_corrections + ';' + corr) if current_corrections else corr

    # 3. Industry Standardization
    if 'industry' in df.columns:
        df['suggested_industry'] = df['industry']
        industry_map = {
            'saas': 'Technology', 'software': 'Technology', 'it': 'Technology', 'internet': 'Technology',
            'finance': 'Financial Services', 'fintech': 'Financial Services', 'crypto': 'Financial Services',
            'medtech': 'Healthcare', 'retail': 'Retail', 'ecommerce': 'Retail', 'manufacturing': 'Manufacturing'
        }

        def fix_industry(ind):
            if pd.isna(ind) or ind == '': return ind, 0.0, None
            i_str = str(ind).lower().strip()
            if i_str in industry_map: return industry_map[i_str], 1.0, 'Industry Standardization'
            for key, val in industry_map.items():
                if key in i_str: return val, 0.8, 'Industry Standardization'
            return ind, 0.0, None

    # 4. Phone Cleaning
    if 'phone' in df.columns:
        df['suggested_phone'] = df['phone']
        def fix_phone(phone):
            if pd.isna(phone) or phone == '': return phone, 0.0, None
            clean = re.sub(r'[^0-9+]', '', str(phone))
            if clean != str(phone): return clean, 1.0, 'Phone Formatting'
            return phone, 0.0, None

    # Main combined loop for efficiency if columns exist
    for idx, row in df.iterrows():
        # Industry
        if 'industry' in df.columns:
            new_ind, conf_i, corr_i = fix_industry(row['industry'])
            if corr_i:
                old_val = df.at[idx, 'industry']
                df.at[idx, 'suggested_industry'] = new_ind
                record_change(idx, 'industry', old_val, new_ind)
                current = str(df.at[idx, 'corrections_applied'])
                df.at[idx, 'corrections_applied'] = (current + ';' + corr_i) if current else corr_i

        # Phone
        if 'phone' in df.columns:
            new_ph, conf_p, corr_p = fix_phone(row['phone'])
            if corr_p:
                old_val = df.at[idx, 'phone']
                df.at[idx, 'suggested_phone'] = new_ph
                record_change(idx, 'phone', old_val, new_ph)
                current = str(df.at[idx, 'corrections_applied'])
                df.at[idx, 'corrections_applied'] = (current + ';' + corr_p) if current else corr_p
            
    return df
            
    return df
