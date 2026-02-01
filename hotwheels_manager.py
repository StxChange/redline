#!/usr/bin/env python3
"""
Hot Wheels Collection Manager
Manages a Hot Wheels car collection with price tracking and market value updates.
"""

import pandas as pd
import os
from datetime import datetime
from typing import Optional
import requests
from bs4 import BeautifulSoup
import time
import re


class HotWheelsManager:
    """Manages Hot Wheels collection data and operations."""

    def __init__(self, excel_file: str = "Redline_Hot_Wheels_Collection.xlsx", log_callback=None):
        self.excel_file = excel_file
        self.backup_file = f"Redline_Hot_Wheels_Collection_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        self.df = None
        self.log_callback = log_callback
        self.load_collection()

    def log(self, message):
        """Log a message using callback if available, otherwise print."""
        if self.log_callback:
            self.log_callback(message)
        else:
            print(message)

    def load_collection(self):
        """Load the collection from Excel file."""
        if os.path.exists(self.excel_file):
            self.df = pd.read_excel(self.excel_file)
            self.log(f"[OK] Loaded {len(self.df)} cars from collection\n")
        else:
            self.log(f"[X] File {self.excel_file} not found!\n")
            self.df = pd.DataFrame()

    def save_collection(self):
        """Save the collection to Excel file."""
        try:
            # Create backup
            if os.path.exists(self.excel_file):
                pd.read_excel(self.excel_file).to_excel(self.backup_file, index=False)
                self.log(f"[OK] Backup created: {self.backup_file}\n")

            # Save current collection
            self.df.to_excel(self.excel_file, index=False)
            self.log(f"[OK] Collection saved to {self.excel_file}\n")
            return True
        except Exception as e:
            self.log(f"[X] Error saving collection: {e}\n")
            return False

    def add_car(self):
        """Add a new car to the collection."""
        print("\n=== Add New Car ===")

        # Essential fields
        car_name = input("Car Name: ").strip()
        if not car_name:
            print("[X] Car name is required")
            return

        brand = input("Brand (Hot Wheels/Matchbox/etc.): ").strip() or "Hot Wheels"
        series = input("Series: ").strip()
        year = input("Year Released: ").strip()
        color = input("Color: ").strip()

        # Purchase information
        purchase_price = input("Purchase Price ($): ").strip()
        try:
            purchase_price = float(purchase_price) if purchase_price else None
        except ValueError:
            purchase_price = None

        purchased_from = input("Purchased From (eBay/Store/etc.): ").strip()
        purchase_location = input("Purchase Location: ").strip()
        date_acquired = datetime.now().strftime("%Y-%m-%d")

        # Condition
        condition = input("Condition (Mint/Good/Fair/Poor): ").strip() or "Good"

        # Display location
        display_location = input("Display Location: ").strip()

        # Notes
        notes = input("Notes: ").strip()

        # Create new row with all columns from the existing dataframe
        new_row = {col: None for col in self.df.columns}

        # Fill in the provided values
        new_row.update({
            'Car Name': car_name,
            'Brand': brand,
            'Series': series,
            'Year Released': year,
            'Color': color,
            'Purchase Price': purchase_price,
            'Purchased From': purchased_from,
            'Purchase Location': purchase_location,
            'Date Acquired': date_acquired,
            'Condition': condition,
            'Display Location': display_location,
            'Notes': notes
        })

        # Add to dataframe
        self.df = pd.concat([self.df, pd.DataFrame([new_row])], ignore_index=True)
        print(f"\n[OK] Added {car_name} to collection")

        # Ask if user wants to check market price
        check_price = input("\nCheck current market price on eBay? (y/n): ").strip().lower()
        if check_price == 'y':
            self.update_single_car_price(len(self.df) - 1)

    def search_ebay_sold_price(self, car_name: str, brand: str = "Hot Wheels") -> Optional[dict]:
        """Search eBay sold listings for a car and return price data."""
        try:
            # Format search query
            search_query = f"{brand} {car_name}".replace(' ', '+')
            url = f"https://www.ebay.com/sch/i.html?_from=R40&_nkw={search_query}&_sacat=0&LH_Sold=1&LH_Complete=1&rt=nc"

            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none'
            }

            self.log(f"  Searching eBay sold listings for: {brand} {car_name}\n")
            response = requests.get(url, headers=headers, timeout=30, allow_redirects=True)

            if response.status_code != 200:
                self.log(f"  [X] eBay request failed with status {response.status_code}\n")
                return None

            soup = BeautifulSoup(response.content, 'html.parser')

            # Find sold items - try multiple selectors
            items = soup.find_all('div', class_='s-item__info')
            if not items:
                items = soup.find_all('li', class_='s-item')
            if not items:
                items = soup.find_all('div', class_='s-item__wrapper')

            if not items or len(items) == 0:
                self.log("  [X] No sold listings found\n")
                self.log("  [!] Note: eBay now loads items dynamically with JavaScript\n")
                self.log("  [!] Web scraping may not work reliably. Consider using manual entry.\n")
                return None

            prices = []
            for item in items[:10]:  # Get up to 10 recent sales
                price_elem = item.find('span', class_='s-item__price')
                if price_elem:
                    price_text = price_elem.text.strip()
                    # Extract numeric price
                    match = re.search(r'\$([0-9,]+\.?[0-9]*)', price_text)
                    if match:
                        price = float(match.group(1).replace(',', ''))
                        prices.append(price)

            if prices:
                avg_price = sum(prices) / len(prices)
                min_price = min(prices)
                max_price = max(prices)

                self.log(f"  [OK] Found {len(prices)} sold listings\n")
                self.log(f"    Average: ${avg_price:.2f} | Range: ${min_price:.2f} - ${max_price:.2f}\n")

                return {
                    'average': avg_price,
                    'min': min_price,
                    'max': max_price,
                    'count': len(prices),
                    'date': datetime.now().strftime("%Y-%m-%d")
                }
            else:
                self.log("  [X] Could not extract prices from listings\n")
                return None

        except Exception as e:
            self.log(f"  [X] Error searching eBay: {e}\n")
            return None

    def update_single_car_price(self, index: int):
        """Update market price for a single car."""
        if index < 0 or index >= len(self.df):
            self.log("[X] Invalid car index\n")
            return

        car = self.df.iloc[index]
        car_name = car['Car Name']
        brand = car['Brand'] if pd.notna(car['Brand']) else "Hot Wheels"

        self.log(f"\nUpdating price for: {car_name}\n")
        price_data = self.search_ebay_sold_price(car_name, brand)

        if price_data:
            self.df.at[index, 'Current Market Value'] = price_data['average']
            self.df.at[index, 'Last Appraisal Date'] = price_data['date']
            self.df.at[index, 'Source of Valuation'] = f"eBay Sold (n={price_data['count']})"

            # Calculate appreciation if purchase price exists
            if pd.notna(car['Purchase Price']) and car['Purchase Price'] > 0:
                appreciation = ((price_data['average'] - car['Purchase Price']) / car['Purchase Price']) * 100
                self.df.at[index, 'Estimated Appreciation (%)'] = appreciation
                self.log(f"  Appreciation: {appreciation:+.2f}%\n")

    def update_all_prices(self):
        """Update market prices for all cars in collection."""
        print("\n=== Update All Market Prices ===")
        confirm = input(f"This will check prices for {len(self.df)} cars. Continue? (y/n): ").strip().lower()

        if confirm != 'y':
            print("Cancelled")
            return

        updated = 0
        failed = 0

        for idx, row in self.df.iterrows():
            if pd.isna(row['Car Name']) or row['Car Name'] == '':
                continue

            print(f"\n[{idx + 1}/{len(self.df)}] {row['Car Name']}")

            try:
                self.update_single_car_price(idx)
                updated += 1
                # Be polite to eBay servers
                time.sleep(2)
            except Exception as e:
                print(f"  [X] Failed: {e}")
                failed += 1

        print(f"\n[OK] Updated {updated} cars, {failed} failed")

    def view_collection(self):
        """Display the collection."""
        print("\n=== Collection Summary ===")

        if self.df.empty:
            print("Collection is empty")
            return

        # Display summary statistics
        total_cars = len(self.df[self.df['Car Name'].notna()])
        print(f"Total Cars: {total_cars}")

        if 'Purchase Price' in self.df.columns:
            total_invested = self.df['Purchase Price'].sum()
            if pd.notna(total_invested):
                print(f"Total Invested: ${total_invested:.2f}")

        if 'Current Market Value' in self.df.columns:
            total_value = self.df['Current Market Value'].sum()
            if pd.notna(total_value):
                print(f"Current Market Value: ${total_value:.2f}")
                if pd.notna(total_invested) and total_invested > 0:
                    profit = total_value - total_invested
                    roi = (profit / total_invested) * 100
                    print(f"Profit/Loss: ${profit:+.2f} ({roi:+.2f}%)")

        # Display recent additions
        print("\n--- Recent Additions (Last 10) ---")
        recent = self.df[self.df['Car Name'].notna()].tail(10)

        for idx, row in recent.iterrows():
            car_name = row['Car Name']
            brand = row['Brand'] if pd.notna(row['Brand']) else "N/A"
            purchase_price = f"${row['Purchase Price']:.2f}" if pd.notna(row['Purchase Price']) else "N/A"
            market_value = f"${row['Current Market Value']:.2f}" if pd.notna(row['Current Market Value']) else "N/A"

            print(f"{idx + 1}. {car_name} ({brand}) | Paid: {purchase_price} | Value: {market_value}")

    def search_collection(self):
        """Search for cars in the collection."""
        print("\n=== Search Collection ===")
        search_term = input("Enter search term (car name, brand, series, etc.): ").strip()

        if not search_term:
            print("[X] Search term required")
            return

        # Search across multiple columns
        mask = self.df.apply(lambda row: row.astype(str).str.contains(search_term, case=False, na=False).any(), axis=1)
        results = self.df[mask]

        if results.empty:
            print(f"[X] No results found for '{search_term}'")
            return

        print(f"\n[OK] Found {len(results)} results:")
        for idx, row in results.iterrows():
            car_name = row['Car Name'] if pd.notna(row['Car Name']) else "Unknown"
            brand = row['Brand'] if pd.notna(row['Brand']) else "N/A"
            year = row['Year Released'] if pd.notna(row['Year Released']) else "N/A"
            color = row['Color'] if pd.notna(row['Color']) else "N/A"
            condition = row['Condition'] if pd.notna(row['Condition']) else "N/A"

            print(f"\n{idx + 1}. {car_name}")
            print(f"   Brand: {brand} | Year: {year} | Color: {color} | Condition: {condition}")

            if pd.notna(row.get('Purchase Price')):
                print(f"   Purchase Price: ${row['Purchase Price']:.2f}")
            if pd.notna(row.get('Current Market Value')):
                print(f"   Market Value: ${row['Current Market Value']:.2f}")
            if pd.notna(row.get('Display Location')):
                print(f"   Location: {row['Display Location']}")


def display_menu():
    """Display the main menu."""
    print("\n" + "="*50)
    print("   HOT WHEELS COLLECTION MANAGER")
    print("="*50)
    print("1. View Collection Summary")
    print("2. Add New Car")
    print("3. Search Collection")
    print("4. Update Single Car Price")
    print("5. Update All Prices (from eBay)")
    print("6. Save Changes")
    print("7. Exit")
    print("="*50)


def main():
    """Main application loop."""
    print("Hot Wheels Collection Manager")
    print("-" * 50)

    manager = HotWheelsManager()

    while True:
        display_menu()
        choice = input("\nEnter your choice (1-7): ").strip()

        if choice == '1':
            manager.view_collection()
        elif choice == '2':
            manager.add_car()
        elif choice == '3':
            manager.search_collection()
        elif choice == '4':
            try:
                car_num = int(input("Enter car number (from search/view): ").strip()) - 1
                manager.update_single_car_price(car_num)
            except ValueError:
                print("[X] Invalid car number")
        elif choice == '5':
            manager.update_all_prices()
        elif choice == '6':
            manager.save_collection()
        elif choice == '7':
            save_prompt = input("Save changes before exiting? (y/n): ").strip().lower()
            if save_prompt == 'y':
                manager.save_collection()
            print("\nThank you for using Hot Wheels Collection Manager!")
            break
        else:
            print("[X] Invalid choice. Please try again.")

        input("\nPress Enter to continue...")


if __name__ == "__main__":
    main()
