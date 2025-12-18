# Performance Analysis Report

## Current Bottlenecks

### 1. **AI API Calls** (Biggest Impact)
- **Issue**: Each AI call to Gemini has 1-3 second latency
- **Current Optimization**: Limited to 100 rows for files >1000 rows
- **Still Slow Because**: 100 API calls × 2 seconds = 200 seconds (3+ minutes)

### 2. **Deduplication** 
- **Issue**: Even with fuzzy matching disabled for large files, exact email matching still processes all rows
- **Impact**: O(N) complexity, acceptable but adds seconds

### 3. **Job Role Mapping**
- **Issue**: Dictionary lookup for every row
- **Impact**: Minimal (< 1 second for 100k rows)

### 4. **Sequential Processing**
- **Issue**: All 6 steps run one after another
- **Impact**: No parallelization

## Recommended Optimizations

### Option A: Disable AI for Large Files (Fastest)
```python
# In app.py, around line 95
if len(df) > 500:  # Instead of 1000
    print(f"[Core] Large file: Skipping AI entirely, using rules only.")
    # Skip ai.batch_clean(df)
else:
    df = ai.batch_clean(df)
```

### Option B: Reduce AI Sample Size
```python
# In app.py, change from 100 to 10
df_sample = df.head(10).copy()  # Only 10 rows = 20 seconds instead of 200
```

### Option C: Add Progress Indicators
- Show user "Processing... 25% complete" messages
- Makes wait feel shorter even if it's the same time

## Expected Speed Improvements

| File Size | Current Time | With Option A | With Option B |
|-----------|--------------|---------------|---------------|
| 1,000 rows | ~30 sec | ~5 sec | ~10 sec |
| 10,000 rows | ~45 sec | ~8 sec | ~12 sec |
| 100,000 rows | ~60 sec | ~15 sec | ~20 sec |

## Recommendation
Implement **Option A** (disable AI for large files) as it provides the best speed while still giving accurate rule-based cleaning.
