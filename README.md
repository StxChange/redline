# Hot Wheels Collection Manager

A Python application for managing your Hot Wheels car collection with automatic market price tracking from eBay sold listings.

**Available in TWO versions:**
- **GUI Version** - Modern graphical interface with tabs and visual dashboard
- **CLI Version** - Command-line interface for terminal users

## Features

- Load and manage your existing Hot Wheels collection from Excel
- Add new cars to your collection with detailed information
- Track current market prices (manual entry or eBay sold listings)
- Track purchase prices and calculate profit/loss
- Search your collection by car name, brand, series, or any field
- View collection summary with total value and ROI
- Automatic backup before saving changes
- **[GUI]** Visual dashboard with statistics
- **[GUI]** Sortable and searchable table view
- **[GUI]** Detailed car information viewer
- **[GUI]** Real-time progress tracking for price updates
- **[GUI]** Auto-save on all major operations (add, delete, price updates)

## Installation

1. Make sure you have Python 3.7 or higher installed

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install pandas openpyxl requests beautifulsoup4
```

## Usage

### GUI Version (Recommended)

Run the graphical interface:
```bash
python hotwheels_gui.py
```

**Features:**
- **Collection Tab**: View all cars in a sortable table with search functionality
- **Add New Car Tab**: Intuitive form to add new cars to your collection
- **Update Prices Tab**: Update market prices for single cars or entire collection
- **Statistics Header**: Real-time display of total cars, invested amount, market value, and profit/loss

**GUI Controls:**
- Double-click any car to view full details
- Use the search box to filter cars instantly
- Sort by any column by clicking the column header
- Delete cars with the "Delete Selected" button
- Save changes anytime with "Save Collection" button

### CLI Version

Run the command-line interface:
```bash
python hotwheels_manager.py
```

### Menu Options

**1. View Collection Summary**
- Display total number of cars
- Show total invested amount
- Show current market value
- Display recent additions

**2. Add New Car**
- Enter car details (name, brand, series, year, color, etc.)
- Record purchase information (price, location, date)
- Optionally check current market price immediately

**3. Search Collection**
- Search across all fields (car name, brand, series, color, etc.)
- View detailed information for matching cars

**4. Update Single Car Price**
- Update market price for a specific car from eBay sold listings
- Automatically calculate appreciation percentage

**5. Update All Prices**
- Batch update market prices for entire collection
- Fetches recent eBay sold listings for each car
- Calculates average, min, and max prices

**6. Save Changes**
- Save collection to Excel file
- Automatic backup created before saving

**7. Exit**
- Option to save changes before exiting

## Excel File Structure

The application uses the existing `Redline_Hot_Wheels_Collection.xlsx` file with the following key columns:

- **Car Name**: Name of the car model
- **Brand**: Hot Wheels, Matchbox, etc.
- **Series**: Series name
- **Year Released**: Year the model was released
- **Color**: Primary color of the car
- **Purchase Price**: Amount paid for the car
- **Purchased From**: Where the car was purchased
- **Date Acquired**: Purchase date
- **Condition**: Mint, Good, Fair, Poor
- **Current Market Value**: Latest market price (auto-updated)
- **Last Appraisal Date**: Date of last price check
- **Source of Valuation**: Where the price came from
- **Estimated Appreciation (%)**: Percent change from purchase price
- **Display Location**: Where the car is stored/displayed

## Price Tracking

The application searches eBay's sold listings to find recent sales of matching cars. It:

- Searches for completed/sold listings only
- Analyzes up to 10 recent sales
- Calculates average, minimum, and maximum prices
- Records the date of valuation and number of listings found
- Respects eBay's servers with appropriate delays between requests

## Backup System

Every time you save changes:
- A backup file is automatically created with timestamp
- Format: `Redline_Hot_Wheels_Collection_backup_YYYYMMDD_HHMMSS.xlsx`
- Original file is preserved before any changes

## Tips

### General Tips

1. **Adding New Cars**: Enter as much information as you have. All fields except "Car Name" are optional.

2. **Price Updates**: Be patient when updating all prices, as the application waits 2 seconds between requests to be respectful to eBay's servers.

3. **Search Tips**: Search terms are case-insensitive and will match partial text in any field.

4. **Data Accuracy**: eBay prices are estimates based on recent sales and may vary. Use them as general market indicators.

5. **Regular Backups**: While the app creates backups, consider manually copying your Excel file periodically.

### GUI-Specific Tips

1. **Quick Search**: The search box in the Collection tab filters results in real-time as you type.

2. **Sorting**: Click any column header to sort by that column. This helps organize your view.

3. **Double-Click Details**: Double-click any car in the table to see all available information in a popup window.

4. **Statistics**: The header displays real-time statistics that update automatically when you make changes.

5. **Background Updates**: Price updates run in a background thread, so you can still interact with the GUI while they're running.

6. **Easy Launcher**: Double-click the `launch_gui.bat` file (Windows) to start the application quickly.

## Troubleshooting

**Automatic price updates not working**:
- eBay now uses dynamic JavaScript to load content
- Web scraping may fail with "No sold listings found" errors
- **Solution**: Use the Manual Price Entry feature in the GUI
- Research prices on eBay manually, then enter them in the app
- See [EBAY_SCRAPING_ISSUE.md](EBAY_SCRAPING_ISSUE.md) for detailed explanation

**No prices found**:
- The car name might be too specific or too generic
- Try searching eBay manually to see if listings exist
- Some rare cars may not have recent sold listings
- Use Manual Price Entry if automatic lookup fails

**Connection errors**:
- Check your internet connection
- eBay might be temporarily unavailable
- Try again in a few minutes
- Consider using Manual Price Entry instead

**Excel file issues**:
- Make sure the Excel file isn't open in another program
- Check that you have write permissions in the directory

## Future Enhancements

Possible features for future versions:
- Export to PDF or HTML reports
- Price alerts when values change significantly
- Integration with other marketplaces (Mercari, Facebook Marketplace)
- Image management
- Statistical analysis and charts
- Database backend for larger collections

## License

This is a personal collection management tool. Use at your own discretion.

## Disclaimer

This tool is for personal collection management only. Web scraping should be done responsibly and in accordance with website terms of service. The application includes delays and limits to be respectful of server resources.

# Redline Pricing Guide — Local Demo

This folder contains a small demo site promoting the Redline Pricing Guide and a downloadable `hotwheels_manager.py` program.

Files added:
- `index.html` — Landing page for the Redline Pricing Guide.
- `assets/style.css` — Simple styles for the demo page.
- `assets/car_uncommon_1.svg`, `assets/car_uncommon_2.svg`, `assets/car_uncommon_3.svg` — Stylized placeholder images for uncommon Redline cars.

How to view:
1. Open `index.html` in your browser or right-click and choose "Open with Live Server" in VS Code.
2. The page includes a download link to `hotwheels_manager.py` in this folder.

How to run `hotwheels_manager.py`:

```powershell
python hotwheels_manager.py
```

Notes:
- The site uses stylized, unbranded SVG illustrations. Do not use Mattel-owned logos or copyrighted photos without permission.
- If you'd like real photos of specific Redline cars added, provide images and I can add them to the gallery and wire them into the app.
