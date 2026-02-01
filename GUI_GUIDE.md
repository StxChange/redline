# Hot Wheels Collection Manager - GUI Guide

## Quick Start

1. Double-click `launch_gui.bat` or run `python hotwheels_gui.py`
2. The application will load your collection automatically
3. Browse your cars in the Collection tab

## Interface Overview

### Header (Top Section)
The header displays real-time statistics about your collection:
- **Total Cars**: Number of cars in your collection
- **Total Invested**: Sum of all purchase prices
- **Market Value**: Sum of all current market values
- **Profit/Loss**: Difference between market value and invested amount (green = profit, red = loss)

### Tab Navigation

The application has three main tabs:

#### 1. Collection Tab

**Main Features:**
- **Search Box**: Type to filter cars instantly by any field
- **Sortable Columns**: Click any column header to sort by that column
- **Action Buttons**:
  - `Refresh`: Reload the collection from Excel
  - `View Details`: Show all information for the selected car
  - `Delete Selected`: Remove a car from the collection (auto-saves after deletion)
  - `Save Collection`: Manually save changes (note: most operations auto-save now)

**Table Columns:**
- Car Name
- Brand
- Series
- Year
- Color
- Condition
- Purchase Price
- Market Value
- Profit/Loss
- Location

**Tips:**
- Double-click any row to see full details
- Use Ctrl+Click to select a specific car before clicking action buttons
- The search box searches across ALL fields, not just what's visible

#### 2. Add New Car Tab

A scrollable form with sections for entering new car information:

**Car Information:**
- Car Name (required)
- Brand (defaults to "Hot Wheels")
- Series
- Year Released
- Model Number
- Color

**Purchase Details:**
- Purchase Price (in dollars)
- Purchased From (eBay, store name, etc.)
- Purchase Location

**Condition:**
- Overall Condition (defaults to "Good")
- Paint Condition
- Wheel Condition

**Storage:**
- Display Location
- Notes (large text area for any additional information)

**Buttons:**
- `Add Car to Collection`: Saves the car to the dataframe AND spreadsheet automatically, then asks if you want to check the market price
- `Clear Form`: Resets all fields

**Tips:**
- Only Car Name is required; all other fields are optional
- The form automatically adds today's date as the acquisition date
- After adding, the car is AUTOMATICALLY SAVED to the Excel file (with backup)
- You'll then be prompted to check the current market price

#### 3. Update Prices Tab

Two sections for updating market prices from eBay:

**Update Single Car:**
- Enter the car's index number (from the Collection tab)
- Click "Update Price" to check eBay sold listings for that specific car
- Progress is shown in the console below
- Changes are AUTOMATICALLY SAVED to the spreadsheet after updating
- **Note**: eBay scraping may not work due to dynamic content - see Manual Entry below

**Manual Price Entry (Recommended):**
- Enter the car index (from Collection tab)
- Enter the market price you researched manually on eBay
- Click "Set Price" to update and auto-save
- **Why**: eBay now loads content with JavaScript, making automatic scraping unreliable
- **How to research**: Visit eBay, search for the car, filter by Sold listings, check recent prices

**Update All Prices:**
- Click "Update All Prices" to check eBay for your entire collection
- A confirmation dialog will appear
- Progress is tracked in real-time in the console
- Takes approximately 2 seconds per car (to be respectful to eBay)
- All changes are AUTOMATICALLY SAVED to the spreadsheet when complete
- **Note**: May fail for many cars due to eBay's dynamic content loading

**Progress Console:**
- Shows detailed progress of price updates
- Displays search results (average, min, max prices)
- Shows how many sold listings were found
- Highlights errors in red

**Tips:**
- Car indices start at 0 (first car is 0, second is 1, etc.)
- You can view car indices by looking at the position in the Collection tab
- The progress console uses a dark theme for better readability
- Updates run in a background thread, so you can switch tabs while they run

### Status Bar (Bottom)

The status bar shows the current state of the application:
- "Ready" when idle
- "Loaded X cars" after loading
- "Collection saved" after saving
- "Updating price..." during price checks

## Auto-Save Feature

**Important:** The application now AUTO-SAVES in the following situations:
- ✓ When you add a new car
- ✓ When you delete a car
- ✓ When you update a single car's price
- ✓ When you update all prices

Each auto-save creates an automatic backup with timestamp, so your data is always protected.

You can still use the "Save Collection" button manually if needed, but it's no longer required for most operations.

## Common Workflows

### Adding a New Purchase

1. Go to "Add New Car" tab
2. Fill in at least the Car Name
3. Enter Purchase Price if you want to track profit/loss
4. Click "Add Car to Collection" (auto-saves immediately)
5. Choose "Yes" when asked about checking the market price
6. Go to "Update Prices" tab and update the price (auto-saves after update)

### Checking Current Values

**Recommended Method (Manual Entry):**
1. Research prices on eBay.com (filter by Sold listings)
2. Note the car index from Collection tab
3. Go to "Update Prices" tab
4. Use "Manual Price Entry" section
5. Enter index and price, click "Set Price" (auto-saves)
6. Return to Collection tab to see updated value

**Automatic Method (may not work):**
1. Go to "Update Prices" tab
2. For one car: Enter its index and click "Update Price" (auto-saves if successful)
3. For all cars: Click "Update All Prices" and confirm (auto-saves when complete)
4. Watch the progress console for results
5. If it fails, use Manual Entry instead

### Finding a Specific Car

1. Go to "Collection" tab
2. Type part of the car name (or any detail) in the search box
3. The table filters automatically
4. Double-click to see full details
5. Clear the search box to see all cars again

### Viewing Collection Value

- Just look at the header statistics
- Green profit/loss means your collection has appreciated
- Red profit/loss means current value is below what you paid
- Values update automatically when you refresh or make changes

### Removing a Car

1. Go to "Collection" tab
2. Click once on the car you want to remove
3. Click "Delete Selected"
4. Confirm the deletion (auto-saves immediately)

## Keyboard Shortcuts

- **Enter** in search box: Apply filter (happens automatically as you type)
- **Double-Click** on car: View full details
- **Single-Click** on car: Select for actions (delete, view details)

## Data Management

### Saving
- Always click "Save Collection" to persist your changes
- An automatic backup is created each time you save
- Backup format: `Redline_Hot_Wheels_Collection_backup_YYYYMMDD_HHMMSS.xlsx`

### Backups
- Check your project folder for backup files
- Backups are timestamped
- You can restore by renaming a backup to `Redline_Hot_Wheels_Collection.xlsx`

### Excel Integration
- Changes are written to the Excel file when you save
- You can edit the Excel file directly and then click "Refresh" in the GUI
- All 54 columns from your original Excel are preserved

## Troubleshooting

### GUI doesn't start
- Make sure Python 3.7+ is installed
- Run: `pip install -r requirements.txt`
- Check the console for error messages

### Price updates fail
- Check your internet connection
- eBay might be blocking requests (wait a few minutes)
- Some rare cars may not have recent sold listings
- Try updating just one car first to test

### Car not found in search
- Make sure there are no typos
- Try searching for just part of the name
- Search is case-insensitive
- Clear the search box and browse manually

### Statistics showing "--"
- This means no data is available for that statistic
- Add purchase prices to see invested amount
- Update prices to see market values
- Both are needed to calculate profit/loss

## Advanced Features

### Sorting
- Click any column header to sort by that column
- Click again to reverse the sort order
- Useful for finding most profitable cars, oldest cars, etc.

### Bulk Operations
- Update all prices before a big sale
- Export statistics to plan your collection strategy
- Use search to find all cars of a specific brand/series

### Collection Analysis
- Sort by Profit/Loss to see best investments
- Filter by brand to focus on specific manufacturers
- Use market value column to identify valuable pieces
- Track appreciation percentage over time

## Tips for Best Results

1. **Keep data updated**: Update prices regularly to track trends
2. **Detailed notes**: Use the Notes field for special information
3. **Consistent naming**: Use similar naming conventions for easier searching
4. **Regular backups**: The app creates automatic backups, but consider manual backups too
5. **Accurate purchase info**: Record purchase prices accurately for profit tracking
6. **Be patient with updates**: Price updates take time but provide valuable data

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review the main README.md file
3. Make sure all dependencies are installed
4. Try restarting the application
5. Check the console output for error messages

## Version Information

- **GUI Version**: Full-featured graphical interface
- **CLI Version**: Also available via `hotwheels_manager.py`
- Both versions share the same data file and are fully compatible
