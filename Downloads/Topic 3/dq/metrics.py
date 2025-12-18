import pandas as pd
from collections import Counter

def calculate_metrics(df):
    """
    Calculates completeness, issue rate, duplicate rate, and scores.
    """
    total_records = len(df)
    if total_records == 0:
        return {
            'before_score': 0,
            'after_score': 0,
            'improvement': 0,
            'improvement_pct': 0,
            'issue_summary': {},
            'remedy_summary': {}
        }
    
    # 1. Completeness
    # A record is complete if it has NO missing tags for ANY original column
    def is_complete_record(issues_str, cols):
        if pd.isna(issues_str) or issues_str == '':
            return True
        
        # Check for any missing_[column] tag where [column] is an original header
        tags = [t.strip() for t in str(issues_str).split(';') if t.strip()]
        for col in cols:
            if f'missing_{col}' in tags:
                return False
        return True

    # Identify original columns (exclude internal DQ columns)
    internal_cols = ['issues', 'has_issues', 'is_duplicate', 'duplicate_group', 'duplicate_type', 'change_history', 'corrections_applied', 'ai_suggestions']
    original_cols = [c for c in df.columns if c not in internal_cols]
    
    complete_count = df['issues'].apply(lambda x: is_complete_record(x, original_cols)).sum()
    completeness = (complete_count / total_records)
    
    # 2. Issue Rate
    records_with_issues = df['has_issues'].eq(True).sum()
    issue_rate = records_with_issues / total_records
    
    # 3. Duplicate Rate
    # Note: is_duplicate is marked by find_duplicates for BOTH Exact and Partial redundant rows
    duplicate_count = df['is_duplicate'].sum() if 'is_duplicate' in df.columns else 0
    duplicate_rate = duplicate_count / total_records
    
    completeness_100 = completeness * 100
    
    before_score = (completeness_100 * 0.3) + ((1 - issue_rate) * 100 * 0.4) + ((1 - duplicate_rate) * 100 * 0.3)
    
    # After Score (Simulated)
    after_issue_rate = issue_rate * 0.5
    after_duplicate_rate = duplicate_rate * 0.5
    after_score = (completeness_100 * 0.3) + ((1 - after_issue_rate) * 100 * 0.4) + ((1 - after_duplicate_rate) * 100 * 0.3)
    
    improvement = after_score - before_score
    improvement_pct = (improvement / before_score * 100) if before_score > 0 else 0
    
    # Issue Breakdown
    all_issues = []
    if 'issues' in df.columns:
        for val in df['issues'].dropna():
            if val:
                all_issues.extend(val.split(';'))
    issue_counts = dict(Counter(all_issues))
    
    # Remedy Breakdown
    all_remedies = []
    if 'corrections_applied' in df.columns:
        for val in df['corrections_applied'].dropna():
            if val:
                all_remedies.extend(val.split(';'))
    remedy_counts = dict(Counter(all_remedies))

    total_field_issues = len(all_issues)

    # Safe integer conversion helper
    def safe_int(val):
        try:
            if pd.isna(val) or val == float('inf') or val == float('-inf'):
                return 0
            return int(val)
        except:
            return 0

    # Column Health Calculation (Dynamic for ALL Columns)
    column_health = {}
    
    for col in original_cols:
        col_missing_tag = f'missing_{col}'
        col_invalid_tag = f'invalid_{col}' # Generic invalid check
        
        missing_count = 0
        invalid_count = 0
        
        if 'issues' in df.columns:
            for issues in df['issues'].dropna():
                tags = [t.strip() for t in str(issues).split(';') if t.strip()]
                if col_missing_tag in tags:
                    missing_count += 1
                # Check for any invalid_[col] variations (like invalid_email_format if col is email)
                if any(t.startswith(f'invalid_{col}') for t in tags) or any(t.startswith('invalid_') and col in t for t in tags):
                    invalid_count += 1
        
        total_col_issues = missing_count + invalid_count
        col_health_pct = ((total_records - total_col_issues) / total_records * 100) if total_records > 0 else 0
        
        column_health[col] = {
            'health_pct': round(col_health_pct, 1),
            'missing': missing_count,
            'invalid': invalid_count
        }

    return {
        'before_score': safe_int(before_score),
        'after_score': safe_int(after_score),
        'quality_score': safe_int(after_score), 
        'improvement': safe_int(improvement),
        'improvement_pct': safe_int(improvement_pct),
        'issue_summary': issue_counts,
        'remedy_summary': remedy_counts,
        'completeness_pct': safe_int(completeness_100),
        'issue_rate_val': issue_rate, 
        'duplicate_rate_val': duplicate_rate,
        'total_issues': int(records_with_issues),
        'total_field_issues': int(total_field_issues),
        'duplicates_found': int(duplicate_count),
        'column_count': int(len(original_cols)),
        'column_health': column_health
    }
