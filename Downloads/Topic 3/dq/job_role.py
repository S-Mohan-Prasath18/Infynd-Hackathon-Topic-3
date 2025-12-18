import pandas as pd
import re

def map_job_roles(df):
    """
    Maps job titles to 6 standardized functions.
    Sales, Marketing, IT, Operations, Finance, HR
    """
    
    # Ordered by priority (Specific -> Generic)
    roles = {
        'RND': ['scientist', 'research', 'rnd', 'lab'],
        'Legal': ['lawyer', 'legal', 'attorney', 'counsel', 'jurist'],
        'Medical': ['nurse', 'medical', 'doctor', 'physician', 'health', 'clinical'],
        'Education': ['teacher', 'education', 'professor', 'tutor', 'academic', 'faculty'],
        'Production': ['production', 'media', 'producer'],
        'Engineering': ['engineer', 'civil', 'mechanical', 'electrical', 'software', 'developer'],
        'Sales': ['sales', 'sdr', 'bdr', 'ae', 'closer', 'selling'],
        'Marketing': ['marketing', 'brand', 'content', 'seo', 'growth', 'advertising'],
        'HR': ['hr', 'human resources', 'recruiter', 'talent', 'people', 'payroll'],
        'Account': ['accountant', 'counting', 'audit', 'tax'], # User: Accountant -> Account
        'Development': ['business dev', 'development', 'partnership', 'fundraising'],
        'Admin': ['admin', 'assistant', 'clerk', 'secretary', 'receptionist'],
        'Operations': ['operations', 'ops', 'logistics', 'supply', 'fulfillment'],
        'Management': ['director', 'manager', 'president', 'ceo', 'founder', 'chief', 'head', 'lead', 'executive']
    }
    
    df['role_function'] = 'Other'
    df['role_confidence'] = 0.0
    
    def get_role(title):
        if pd.isna(title):
            return 'Other', 0.0
            
        t = str(title).lower()
        
        # Check against keywords
        # Priority? Maybe simple first match.
        
        for role, keywords in roles.items():
            for kw in keywords:
                if kw in t:
                    # Basic confidence: 0.9 if closer match?
                    # Let's say 0.95 for direct containment
                    return role, 0.95
                    
        return 'Other', 0.0

    for idx, row in df.iterrows():
        role, conf = get_role(row.get('job_title', '')) # Assuming column is job_title, prompt says "Role Function Mapping" but sample usually has job_title
        if role != 'Other':
            df.at[idx, 'role_function'] = role
            df.at[idx, 'role_confidence'] = conf
            
            # Corrections applied logic: add to the list if mapped?
            # Prompt says: "Role Function Mapping: 6 titles (95%)" in remedies applied
            if conf > 0:
                current_corrections = str(df.at[idx, 'corrections_applied']) if 'corrections_applied' in df.columns else ''
                # If corrections_applied column wasn't created yet (depends on order), handle it.
                # It should exist from corrections.py if run in sequence.
                correction_text = 'Role Function Mapping'
                # Avoid dupes in the string list if possible, but simplicity first.
                sep = ';' if current_corrections else ''
                df.at[idx, 'corrections_applied'] = current_corrections + sep + correction_text

    return df
