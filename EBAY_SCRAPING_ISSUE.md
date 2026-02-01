# eBay Scraping Issue and Solutions

## Problem

**eBay has changed their website to use dynamic JavaScript content loading.** This means that when you request a page with simple HTTP requests (like our scraper does), you get an HTML page that doesn't contain the actual item listings. The listings are loaded by JavaScript after the page loads in a browser.

### Technical Details

- **Old Behavior**: eBay served complete HTML with item listings that could be parsed with BeautifulSoup
- **New Behavior**: eBay serves a skeleton HTML page and loads items dynamically with JavaScript
- **Result**: Our web scraper receives HTML with no item data, causing "No sold listings found" errors

## Solutions Implemented

### 1. **Manual Price Entry (RECOMMENDED)**

The GUI now includes a "Manual Price Entry" section on the Update Prices tab where you can:
- Enter the car index (from the Collection tab)
- Enter the market price you researched manually
- Click "Set Price" to update and auto-save

**How to use:**
1. Search for your car on eBay manually in a browser
2. Look at sold listings to determine a fair market price
3. Enter that price in the Manual Price Entry section
4. The app will calculate appreciation and save automatically

### 2. **Better Error Messages**

The application now provides clearer feedback when automatic price updates fail:
- Shows when eBay returns no results
- Explains that eBay uses dynamic content loading
- Suggests using manual entry instead

### 3. **Improved HTTP Headers**

Updated the web scraper with better browser-like headers to reduce detection:
- Modern Chrome User-Agent
- Complete header set (Accept, Language, etc.)
- Increased timeout to 30 seconds

## Alternative Solutions (Future)

### Option A: Use eBay's Official API

**Pros:**
- Reliable and officially supported
- Proper data access without scraping
- Won't break when eBay changes their website

**Cons:**
- Requires eBay developer account
- API key management
- May have rate limits
- More complex implementation

**Implementation:** Would require users to get their own eBay API keys from https://developer.ebay.com/

### Option B: Use Selenium/Playwright

**Pros:**
- Can execute JavaScript like a real browser
- Would see the same content as manual browsing
- More robust for dynamic sites

**Cons:**
- Much heavier (requires installing Chrome/Firefox)
- Slower (must wait for pages to fully load)
- More complex setup
- Higher resource usage

### Option C: Alternative Price Sources

Consider using other sources for pricing data:
- WorthPoint (subscription service)
- PriceCharting (for collectibles)
- Manual community price lists
- User-maintained price databases

## Current Recommendation

**Use the Manual Price Entry feature** until a more automated solution is implemented. This approach:
- ✓ Works 100% reliably
- ✓ Lets you use your own judgment
- ✓ No external dependencies
- ✓ Immediate results
- ✓ Auto-saves to spreadsheet

## Workflow for Manual Pricing

1. **Research on eBay**:
   - Go to eBay.com
   - Search for "Hot Wheels [car name]"
   - Filter by Sold listings
   - Check completed sales for price range
   - Calculate an average or pick representative price

2. **Enter in App**:
   - Go to Collection tab to find car index
   - Switch to Update Prices tab
   - Use Manual Price Entry section
   - Enter index and price
   - Click "Set Price"

3. **Done!**:
   - Price is saved automatically
   - Appreciation calculated
   - Collection value updated
   - Backup created

## For Developers

If you want to implement eBay API integration:

```python
# Example using eBay Finding API
from ebaysdk.finding import Connection as Finding

api = Finding(appid='YOUR_APP_ID', config_file=None)
response = api.execute('findCompletedItems', {
    'keywords': 'Hot Wheels Deora',
    'categoryId': '180332',  # Diecast Cars
    'itemFilter': [
        {'name': 'SoldItemsOnly', 'value': True}
    ],
    'sortOrder': 'EndTimeSoonest'
})

# Parse response for prices
for item in response.dict()['searchResult']['item']:
    price = item['sellingStatus']['currentPrice']['value']
    # Process price...
```

## Support

If you have questions or want to contribute improvements:
1. Check the main [README.md](README.md)
2. Review [GUI_GUIDE.md](GUI_GUIDE.md) for manual entry instructions
3. Report issues at GitHub (if repository is public)

## Last Updated

2026-01-25 - Added manual price entry feature to work around eBay's dynamic content loading
