import pandas as pd
import re
from rapidfuzz import fuzz

def deep_normalize(val):
    """Aggressive normalization to hide minor naming variations."""
    if pd.isna(val) or val == '': return ''
    s = str(val).lower().strip()
    # Remove punctuation
    s = re.sub(r'[^\w\s]', '', s)
    # Remove common business suffixes
    s = re.sub(r'\b(inc|llc|ltd|corp|corporation|group|pvt|co|company|holdings)\b', '', s)
    return " ".join(s.split())

def find_duplicates(df, ai_cleaner=None, threshold=75): # Slightly lower threshold for better recall
    """
    Identifies duplicate records in two categories:
    1. Exact (Full-row identical after normalization)
    2. Partial (High similarity score based on key columns)
    """
    df['is_duplicate'] = False
    df['duplicate_group'] = None
    df['duplicate_type'] = None 
    
    total_rows = len(df)
    if total_rows == 0:
        return df, {"summary": {"total": 0, "exact": 0, "partial": 0, "pct": 0}}

    report = {
        "summary": {"total": total_rows, "exact": 0, "partial": 0, "pct": 0},
        "exact_groups": [],
        "partial_groups": []
    }

    # 1. Exact Duplicate Search (Full Row)
    df_norm = df.copy()
    for col in df_norm.columns:
        if df_norm[col].dtype == 'object':
            df_norm[col] = df_norm[col].apply(deep_normalize)
    
    exact_dupes = df_norm.duplicated(keep=False)
    if exact_dupes.any():
        df.loc[exact_dupes, 'duplicate_type'] = 'Exact'
        # Filter columns to only those that exist and are not internal
        comp_cols = [c for c in df_norm.columns if c not in ['issues', 'has_issues']]
        exact_groups = df_norm[exact_dupes].groupby(comp_cols).indices
        
        for i, (val, indices) in enumerate(exact_groups.items()):
            gid = f"EXACT_{i+1}"
            df.loc[indices, 'duplicate_group'] = gid
            primary_idx = indices[0]
            for idx in indices[1:]:
                df.at[idx, 'is_duplicate'] = True
            
            report["exact_groups"].append({
                "id": gid,
                "rows": [int(x) for x in indices],
                "count": len(indices),
                "primary": int(primary_idx)
            })
            report["summary"]["exact"] += (len(indices) - 1)

    # 2. Partial Duplicate Search
    core_cols = [c for c in ['company_name', 'person_name', 'email', 'domain_id', 'phone', 'website', 'postal_code'] if c in df.columns]
    
    if len(core_cols) > 0:
        pending_mask = ~df['is_duplicate'] & (df['duplicate_type'] != 'Exact')
        pending_indices = df[pending_mask].index.tolist()
        partial_count = 0
        COMP_LIMIT = 300 # Reduced limit for higher quality thorough check
        indices_to_check = pending_indices[:COMP_LIMIT]
        
        for i in range(len(indices_to_check)):
            idx_a = indices_to_check[i]
            if df.at[idx_a, 'is_duplicate']: continue

            for j in range(i + 1, len(indices_to_check)):
                idx_b = indices_to_check[j]
                if df.at[idx_b, 'is_duplicate']: continue
                
                # Fuzzy comparison on normalized core metrics
                str_a = " ".join([deep_normalize(df.at[idx_a, c]) for c in core_cols])
                str_b = " ".join([deep_normalize(df.at[idx_b, c]) for c in core_cols])
                
                score = fuzz.token_sort_ratio(str_a, str_b)
                
                if score >= threshold:
                    confirmed = True
                    reason = "High fuzzy similarity"
                    
                    if score < 92 and ai_cleaner: # AI audit for lower confidence matches
                        confirmed, reason = ai_cleaner.compare_records(df.loc[idx_a].to_dict(), df.loc[idx_b].to_dict())
                    
                    if confirmed:
                        df.at[idx_b, 'is_duplicate'] = True
                        df.at[idx_b, 'duplicate_type'] = 'Partial'
                        gid = f"PARTIAL_{partial_count+1}"
                        df.at[idx_a, 'duplicate_group'] = gid
                        df.at[idx_b, 'duplicate_group'] = gid
                        
                        report["partial_groups"].append({
                            "id": gid,
                            "rows": [int(idx_a), int(idx_b)],
                            "score": score,
                            "reason": reason,
                            "cols": core_cols
                        })
                        report["summary"]["partial"] += 1
                        partial_count += 1

    report["summary"]["pct"] = round((report["summary"]["exact"] + report["summary"]["partial"]) / total_rows * 100, 1) if total_rows > 0 else 0
    return df, report



