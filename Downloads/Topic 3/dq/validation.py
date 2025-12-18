import pandas as pd
import re

def validate_data(df, ai_mapping=None):
    """
    Detects missing fields and format errors.
    Supports optional AI-discovered mapping.
    """
    issues = []
    
    # Intelligent Column Mapping
    # Standardize common variations to our internal schema
    column_map = {
        'company': 'company_name',
        'organization': 'company_name',
        'business_name': 'company_name',
        'name': 'person_name',
        'full_name': 'person_name',
        'contact_name': 'person_name',
        'email_address': 'email',
        'mail': 'email',
        'url': 'website',
        'web': 'website',
        'domain': 'website',
        'location': 'country',
        'region': 'country',
        'phone_number': 'phone',
        'mobile': 'phone',
        'contact_number': 'phone',
        'job_title': 'job_title',
        'title': 'job_title',
        'position': 'job_title',
        'role': 'job_title',
        'industry_type': 'industry',
        'sector': 'industry',
        'employee_count': 'size',
        'company_size': 'size',
        'linkedin': 'linkedin_url',
        'profile_url': 'linkedin_url',
        'social': 'linkedin_url',
        'domain_id': 'domain_id',
        'postal_code': 'postal_code',
        'zip_code': 'postal_code',
        'zip': 'postal_code',
        'company_email': 'company_email',
        'corp_email': 'company_email'
    }
    
    # Rename columns if they exist in the map (case-insensitive)
    new_columns = {}
    
    # 1. First apply AI mapping if provided (highest priority)
    if ai_mapping:
        for original, target in ai_mapping.items():
            if original in df.columns:
                new_columns[original] = target

    # 2. Heuristics fallback
    for col in df.columns:
        if col in new_columns: continue # Skip if already mapped by AI
        
        normalized = col.lower().strip().replace(' ', '_')
        if normalized in column_map:
            new_columns[col] = column_map[normalized]
        # Also handle direct matches to schema
        if normalized in ['company_name', 'person_name', 'email', 'website', 'country', 'revenue', 'phone', 'job_title', 'industry', 'size', 'linkedin_url']:
            new_columns[col] = normalized
            
    df.rename(columns=new_columns, inplace=True)
    
    # Remove duplicate columns (keep first)
    df = df.loc[:, ~df.columns.duplicated()]
    
    # 1. Generic Missing Check for ALL Columns
    # This fulfills the "metrics according to headings" requirement
    df['issues'] = ''
    
    for col in df.columns:
        if col in ['issues', 'has_issues', 'is_duplicate', 'duplicate_group', 'duplicate_type']: continue
        
        missing_mask = df[col].isna() | (df[col].astype(str).str.strip() == '')
        issue_name = f'missing_{col}'
        
        # Apply missing tags to rows
        df.loc[missing_mask, 'issues'] = df.loc[missing_mask, 'issues'].apply(
            lambda x: (x + ';' if x else '') + issue_name
        )

    # 2. Specialized Format Validation (only if mapped columns exist)
    # Email Format
    if 'email' in df.columns:
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        invalid_email = df['email'].apply(lambda x: not bool(re.match(email_regex, str(x))) if pd.notna(x) and str(x).strip() != '' else False)
        df.loc[invalid_email, 'issues'] = df.loc[invalid_email, 'issues'].apply(lambda x: (x + ';' if x else '') + 'invalid_email_format')
    
    # Phone Format (basic check: must have at least 7 digits)
    if 'phone' in df.columns:
        def is_invalid_phone(x):
            if pd.isna(x) or str(x).strip() == '': return False
            digits = re.sub(r'\D', '', str(x))
            return len(digits) < 7
        invalid_phone = df['phone'].apply(is_invalid_phone)
        df.loc[invalid_phone, 'issues'] = df.loc[invalid_phone, 'issues'].apply(lambda x: (x + ';' if x else '') + 'invalid_phone_format')
        
    # Website Format
    if 'website' in df.columns:
        invalid_website = df['website'].apply(lambda x: ('.' not in str(x)) if pd.notna(x) and str(x).strip() != '' else False)
        df.loc[invalid_website, 'issues'] = df.loc[invalid_website, 'issues'].apply(lambda x: (x + ';' if x else '') + 'invalid_website_format')
        
    # Revenue/Numeric Format
    if 'revenue' in df.columns:
        def is_invalid_revenue(x):
            if pd.isna(x) or str(x).strip() == '': return False 
            s = str(x).replace(',', '').replace('$', '').strip()
            try:
                float(s)
                return False
            except ValueError:
                return True
        invalid_revenue = df['revenue'].apply(is_invalid_revenue)
        df.loc[invalid_revenue, 'issues'] = df.loc[invalid_revenue, 'issues'].apply(lambda x: (x + ';' if x else '') + 'invalid_revenue_format')

    df['has_issues'] = df['issues'] != ''
    
    return df
