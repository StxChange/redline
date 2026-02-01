#!/usr/bin/env python3
"""
Hot Wheels Collection Manager - GUI Version
A modern graphical interface for managing Hot Wheels collections.
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import pandas as pd
from datetime import datetime
import threading
from hotwheels_manager import HotWheelsManager


class HotWheelsGUI:
    """GUI Application for Hot Wheels Collection Management."""

    def __init__(self, root):
        self.root = root
        self.root.title("Hot Wheels Collection Manager")
        self.root.geometry("1400x800")
        self.root.minsize(1200, 700)

        # Initialize the manager (log_callback will be set later after GUI is created)
        self.manager = HotWheelsManager()

        # Color scheme
        self.colors = {
            'primary': '#1e3a8a',      # Dark blue
            'secondary': '#3b82f6',    # Light blue
            'success': '#10b981',      # Green
            'danger': '#ef4444',       # Red
            'warning': '#f59e0b',      # Orange
            'dark': '#1f2937',         # Dark gray
            'light': '#f3f4f6',        # Light gray
            'white': '#ffffff',
        }

        # Configure styles
        self.setup_styles()

        # Create main interface
        self.create_header()
        self.create_main_content()
        self.create_status_bar()

        # Set the log callback for the manager to use GUI progress display
        self.manager.log_callback = self.log_progress

        # Load initial data
        self.refresh_collection_view()
        self.update_statistics()

    def setup_styles(self):
        """Configure ttk styles for better appearance."""
        style = ttk.Style()
        style.theme_use('clam')

        # Configure Treeview
        style.configure("Treeview",
                       background=self.colors['white'],
                       foreground=self.colors['dark'],
                       rowheight=25,
                       fieldbackground=self.colors['white'])
        style.map('Treeview', background=[('selected', self.colors['secondary'])])

        # Configure Treeview headings
        style.configure("Treeview.Heading",
                       background=self.colors['primary'],
                       foreground=self.colors['white'],
                       relief="flat",
                       font=('Segoe UI', 9, 'bold'))
        style.map("Treeview.Heading",
                 background=[('active', self.colors['secondary'])])

        # Configure buttons
        style.configure("Primary.TButton",
                       background=self.colors['primary'],
                       foreground=self.colors['white'],
                       borderwidth=0,
                       focuscolor='none',
                       padding=10,
                       font=('Segoe UI', 9))

        style.configure("Success.TButton",
                       background=self.colors['success'],
                       foreground=self.colors['white'],
                       borderwidth=0,
                       focuscolor='none',
                       padding=10,
                       font=('Segoe UI', 9))

    def create_header(self):
        """Create the header section with title and statistics."""
        header_frame = tk.Frame(self.root, bg=self.colors['primary'], height=160)
        header_frame.pack(fill='x', side='top')
        header_frame.pack_propagate(False)

        # Title
        title_label = tk.Label(
            header_frame,
            text="Hot Wheels Collection Manager",
            font=('Segoe UI', 24, 'bold'),
            bg=self.colors['primary'],
            fg=self.colors['white']
        )
        title_label.pack(pady=(15, 10))

        # Statistics frame
        stats_frame = tk.Frame(header_frame, bg=self.colors['primary'])
        stats_frame.pack(fill='x', padx=20, pady=(5, 15))

        # Statistics labels
        self.stats_labels = {}
        stats = [
            ('Total Cars', 'total_cars'),
            ('Total Invested', 'total_invested'),
            ('Market Value', 'market_value'),
            ('Profit/Loss', 'profit_loss')
        ]

        for label_text, key in stats:
            stat_container = tk.Frame(stats_frame, bg=self.colors['primary'])
            stat_container.pack(side='left', expand=True, pady=5)

            label = tk.Label(
                stat_container,
                text=label_text,
                font=('Segoe UI', 10),
                bg=self.colors['primary'],
                fg=self.colors['light']
            )
            label.pack(pady=(0, 5))

            value_label = tk.Label(
                stat_container,
                text="--",
                font=('Segoe UI', 18, 'bold'),
                bg=self.colors['primary'],
                fg=self.colors['white']
            )
            value_label.pack(pady=(0, 5))

            self.stats_labels[key] = value_label

    def create_main_content(self):
        """Create the main content area with notebook tabs."""
        # Create notebook for tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)

        # Create tabs
        self.create_collection_tab()
        self.create_add_car_tab()
        self.create_single_price_tab()
        self.create_batch_price_tab()

    def create_collection_tab(self):
        """Create the collection view tab."""
        collection_frame = ttk.Frame(self.notebook)
        self.notebook.add(collection_frame, text='Collection')

        # Toolbar
        toolbar = tk.Frame(collection_frame, bg=self.colors['light'], height=50)
        toolbar.pack(fill='x', padx=5, pady=5)

        # Search
        tk.Label(toolbar, text="Search:", bg=self.colors['light'],
                font=('Segoe UI', 10)).pack(side='left', padx=5)

        self.search_var = tk.StringVar()
        self.search_var.trace('w', lambda *args: self.filter_collection())
        search_entry = ttk.Entry(toolbar, textvariable=self.search_var, width=30,
                                font=('Segoe UI', 10))
        search_entry.pack(side='left', padx=5)

        # Buttons
        ttk.Button(toolbar, text="Refresh", command=self.refresh_collection_view,
                  style="Primary.TButton").pack(side='left', padx=5)

        ttk.Button(toolbar, text="View Details", command=self.view_car_details,
                  style="Primary.TButton").pack(side='left', padx=5)

        ttk.Button(toolbar, text="Delete Selected", command=self.delete_selected_car,
                  style="Primary.TButton").pack(side='left', padx=5)

        ttk.Button(toolbar, text="Save Collection", command=self.save_collection,
                  style="Success.TButton").pack(side='right', padx=5)

        # Treeview with scrollbar
        tree_frame = tk.Frame(collection_frame)
        tree_frame.pack(fill='both', expand=True, padx=5, pady=5)

        # Scrollbars
        vsb = ttk.Scrollbar(tree_frame, orient="vertical")
        vsb.pack(side='right', fill='y')

        hsb = ttk.Scrollbar(tree_frame, orient="horizontal")
        hsb.pack(side='bottom', fill='x')

        # Treeview
        columns = ('Car Name', 'Brand', 'Series', 'Year', 'Color', 'Condition',
                   'Purchase Price', 'Market Value', 'Profit/Loss', 'Location')

        self.tree = ttk.Treeview(tree_frame, columns=columns, show='headings',
                                yscrollcommand=vsb.set, xscrollcommand=hsb.set)

        vsb.config(command=self.tree.yview)
        hsb.config(command=self.tree.xview)

        # Configure columns
        column_widths = {
            'Car Name': 200,
            'Brand': 100,
            'Series': 120,
            'Year': 70,
            'Color': 100,
            'Condition': 80,
            'Purchase Price': 100,
            'Market Value': 100,
            'Profit/Loss': 100,
            'Location': 150
        }

        for col in columns:
            self.tree.heading(col, text=col, command=lambda c=col: self.sort_column(c))
            self.tree.column(col, width=column_widths[col], anchor='center')

        self.tree.pack(fill='both', expand=True)

        # Bind double-click to view details
        self.tree.bind('<Double-1>', lambda e: self.view_car_details())

    def create_add_car_tab(self):
        """Create the add new car tab."""
        add_frame = ttk.Frame(self.notebook)
        self.notebook.add(add_frame, text='Add New Car')

        # Create scrollable canvas
        canvas = tk.Canvas(add_frame, bg=self.colors['white'])
        scrollbar = ttk.Scrollbar(add_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg=self.colors['white'])

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Main container with padding
        main_container = tk.Frame(scrollable_frame, bg=self.colors['white'])
        main_container.pack(padx=50, pady=30, fill='both', expand=True)

        # Title
        title = tk.Label(
            main_container,
            text="Add New Car to Collection",
            font=('Segoe UI', 18, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['primary']
        )
        title.pack(pady=20)

        # Form fields
        self.add_car_fields = {}

        fields = [
            ('Car Information', [
                ('Car Name*', 'car_name', True),
                ('Brand', 'brand', False, 'Hot Wheels'),
                ('Series', 'series', False),
                ('Year Released', 'year', False),
                ('Model Number', 'model_number', False),
                ('Color', 'color', False),
            ]),
            ('Purchase Details', [
                ('Purchase Price ($)', 'purchase_price', False),
                ('Purchased From', 'purchased_from', False),
                ('Purchase Location', 'purchase_location', False),
            ]),
            ('Condition', [
                ('Condition', 'condition', False, 'Good'),
                ('Paint Condition', 'paint_condition', False),
                ('Wheel Condition', 'wheel_condition', False),
            ]),
            ('Storage', [
                ('Display Location', 'display_location', False),
                ('Notes', 'notes', False, '', True),  # True for text area
            ])
        ]

        for section_title, section_fields in fields:
            # Section title
            section_label = tk.Label(
                main_container,
                text=section_title,
                font=('Segoe UI', 14, 'bold'),
                bg=self.colors['white'],
                fg=self.colors['dark']
            )
            section_label.pack(anchor='w', pady=(20, 10))

            # Section frame
            section_frame = tk.Frame(main_container, bg=self.colors['white'])
            section_frame.pack(fill='x', pady=5)

            for field_info in section_fields:
                label_text = field_info[0]
                field_key = field_info[1]
                is_required = field_info[2] if len(field_info) > 2 else False
                default_value = field_info[3] if len(field_info) > 3 else ""
                is_textarea = field_info[4] if len(field_info) > 4 else False

                field_frame = tk.Frame(section_frame, bg=self.colors['white'])
                field_frame.pack(fill='x', pady=5)

                label = tk.Label(
                    field_frame,
                    text=label_text,
                    font=('Segoe UI', 10),
                    bg=self.colors['white'],
                    fg=self.colors['dark'],
                    width=20,
                    anchor='w'
                )
                label.pack(side='left', padx=5)

                if is_textarea:
                    entry = tk.Text(field_frame, height=4, width=50, font=('Segoe UI', 10))
                    entry.pack(side='left', padx=5, fill='x', expand=True)
                    if default_value:
                        entry.insert('1.0', default_value)
                else:
                    entry_var = tk.StringVar(value=default_value)
                    entry = ttk.Entry(field_frame, textvariable=entry_var, width=50,
                                     font=('Segoe UI', 10))
                    entry.pack(side='left', padx=5, fill='x', expand=True)

                self.add_car_fields[field_key] = entry

        # Buttons
        button_frame = tk.Frame(main_container, bg=self.colors['white'])
        button_frame.pack(pady=30)

        add_button = tk.Button(
            button_frame,
            text="Add Car to Collection",
            command=self.add_car_from_form,
            bg=self.colors['success'],
            fg=self.colors['white'],
            font=('Segoe UI', 12, 'bold'),
            padx=30,
            pady=10,
            relief='flat',
            cursor='hand2'
        )
        add_button.pack(side='left', padx=10)

        clear_button = tk.Button(
            button_frame,
            text="Clear Form",
            command=self.clear_add_form,
            bg=self.colors['warning'],
            fg=self.colors['white'],
            font=('Segoe UI', 12, 'bold'),
            padx=30,
            pady=10,
            relief='flat',
            cursor='hand2'
        )
        clear_button.pack(side='left', padx=10)

        # Pack canvas and scrollbar
        canvas.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

    def create_single_price_tab(self):
        """Create the single car price update tab."""
        price_frame = ttk.Frame(self.notebook)
        self.notebook.add(price_frame, text='Update Single')

        # Main container
        container = tk.Frame(price_frame, bg=self.colors['white'])
        container.pack(fill='both', expand=True, padx=50, pady=30)

        # Title
        title = tk.Label(
            container,
            text="Update Single Car Price",
            font=('Segoe UI', 18, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['primary']
        )
        title.pack(pady=20)

        # Description
        desc = tk.Label(
            container,
            text="Update the market price for a single car from eBay sold listings or enter manually.",
            font=('Segoe UI', 10),
            bg=self.colors['white'],
            fg=self.colors['dark']
        )
        desc.pack(pady=10)

        # Single car update section
        single_frame = tk.LabelFrame(
            container,
            text="Automatic Price Lookup (eBay)",
            font=('Segoe UI', 12, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['dark'],
            padx=20,
            pady=20
        )
        single_frame.pack(fill='x', pady=20)

        tk.Label(
            single_frame,
            text="Car Index (from Collection tab):",
            font=('Segoe UI', 10),
            bg=self.colors['white']
        ).pack(side='left', padx=5)

        self.single_car_index = tk.StringVar()
        ttk.Entry(single_frame, textvariable=self.single_car_index, width=10).pack(side='left', padx=5)

        tk.Button(
            single_frame,
            text="Update Price from eBay",
            command=self.update_single_price,
            bg=self.colors['secondary'],
            fg=self.colors['white'],
            font=('Segoe UI', 10, 'bold'),
            padx=20,
            pady=8,
            relief='flat',
            cursor='hand2'
        ).pack(side='left', padx=10)

        # Manual price entry section (RECOMMENDED)
        manual_frame = tk.LabelFrame(
            container,
            text="Manual Price Entry (Recommended)",
            font=('Segoe UI', 12, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['success'],
            padx=20,
            pady=20
        )
        manual_frame.pack(fill='x', pady=20)

        manual_note = tk.Label(
            manual_frame,
            text="Note: eBay scraping may not work due to dynamic content loading.\n"
                 "Manually enter prices you researched on eBay for best results.",
            font=('Segoe UI', 9),
            bg=self.colors['white'],
            fg=self.colors['dark']
        )
        manual_note.pack(pady=(0, 10))

        manual_entry_frame = tk.Frame(manual_frame, bg=self.colors['white'])
        manual_entry_frame.pack(fill='x')

        tk.Label(
            manual_entry_frame,
            text="Car Index:",
            font=('Segoe UI', 10),
            bg=self.colors['white']
        ).pack(side='left', padx=5)

        self.manual_car_index = tk.StringVar()
        ttk.Entry(manual_entry_frame, textvariable=self.manual_car_index, width=10).pack(side='left', padx=5)

        tk.Label(
            manual_entry_frame,
            text="Market Price ($):",
            font=('Segoe UI', 10),
            bg=self.colors['white']
        ).pack(side='left', padx=5)

        self.manual_price = tk.StringVar()
        ttk.Entry(manual_entry_frame, textvariable=self.manual_price, width=15).pack(side='left', padx=5)

        tk.Button(
            manual_entry_frame,
            text="Set Price",
            command=self.set_manual_price,
            bg=self.colors['success'],
            fg=self.colors['white'],
            font=('Segoe UI', 10, 'bold'),
            padx=20,
            pady=8,
            relief='flat',
            cursor='hand2'
        ).pack(side='left', padx=10)

        # Progress frame for single updates
        progress_frame = tk.LabelFrame(
            container,
            text="Progress / Results",
            font=('Segoe UI', 12, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['dark'],
            padx=20,
            pady=20
        )
        progress_frame.pack(fill='both', expand=True, pady=20)

        self.single_progress_text = scrolledtext.ScrolledText(
            progress_frame,
            height=10,
            font=('Consolas', 9),
            bg='#1e1e1e',
            fg='#d4d4d4',
            insertbackground='white'
        )
        self.single_progress_text.pack(fill='both', expand=True)

    def create_batch_price_tab(self):
        """Create the batch price update tab."""
        batch_frame = ttk.Frame(self.notebook)
        self.notebook.add(batch_frame, text='Update All Prices')

        # Main container
        container = tk.Frame(batch_frame, bg=self.colors['white'])
        container.pack(fill='both', expand=True, padx=50, pady=30)

        # Title
        title = tk.Label(
            container,
            text="Update All Prices (Batch)",
            font=('Segoe UI', 18, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['primary']
        )
        title.pack(pady=20)

        # Description
        desc = tk.Label(
            container,
            text="Automatically update prices for all cars in your collection from eBay sold listings.\n"
                 "This process may take several minutes depending on collection size.",
            font=('Segoe UI', 10),
            bg=self.colors['white'],
            fg=self.colors['dark']
        )
        desc.pack(pady=10)

        # Batch update section
        batch_controls = tk.LabelFrame(
            container,
            text="Batch Update Controls",
            font=('Segoe UI', 12, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['dark'],
            padx=20,
            pady=20
        )
        batch_controls.pack(fill='x', pady=20)

        warning = tk.Label(
            batch_controls,
            text="Warning: This will attempt to update ALL cars in your collection.\n"
                 "Takes approximately 2 seconds per car. eBay scraping may fail for many cars.",
            font=('Segoe UI', 9, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['danger']
        )
        warning.pack(pady=10)

        tk.Button(
            batch_controls,
            text="Start Batch Update",
            command=self.update_all_prices,
            bg=self.colors['warning'],
            fg=self.colors['white'],
            font=('Segoe UI', 12, 'bold'),
            padx=40,
            pady=12,
            relief='flat',
            cursor='hand2'
        ).pack(pady=10)

        # Progress frame - larger for batch operations
        progress_frame = tk.LabelFrame(
            container,
            text="Progress Console",
            font=('Segoe UI', 12, 'bold'),
            bg=self.colors['white'],
            fg=self.colors['dark'],
            padx=20,
            pady=20
        )
        progress_frame.pack(fill='both', expand=True, pady=20)

        self.progress_text = scrolledtext.ScrolledText(
            progress_frame,
            height=25,
            font=('Consolas', 9),
            bg='#1e1e1e',
            fg='#d4d4d4',
            insertbackground='white',
            wrap=tk.WORD
        )
        self.progress_text.pack(fill='both', expand=True)

    def create_status_bar(self):
        """Create the status bar at the bottom."""
        self.status_bar = tk.Label(
            self.root,
            text="Ready",
            relief=tk.SUNKEN,
            anchor='w',
            bg=self.colors['light'],
            fg=self.colors['dark'],
            font=('Segoe UI', 9),
            padx=10
        )
        self.status_bar.pack(side='bottom', fill='x')

    def refresh_collection_view(self):
        """Refresh the collection treeview with current data."""
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)

        # Reload collection
        self.manager.load_collection()
        df = self.manager.df

        # Populate tree
        for idx, row in df.iterrows():
            if pd.isna(row['Car Name']) or row['Car Name'] == '':
                continue

            car_name = row['Car Name']
            brand = row['Brand'] if pd.notna(row['Brand']) else ''
            series = row['Series'] if pd.notna(row['Series']) else ''
            year = row['Year Released'] if pd.notna(row['Year Released']) else ''
            color = row['Color'] if pd.notna(row['Color']) else ''
            condition = row['Condition'] if pd.notna(row['Condition']) else ''

            purchase_price = f"${row['Purchase Price']:.2f}" if pd.notna(row['Purchase Price']) else ''
            market_value = f"${row['Current Market Value']:.2f}" if pd.notna(row['Current Market Value']) else ''

            # Calculate profit/loss
            profit_loss = ''
            if pd.notna(row['Purchase Price']) and pd.notna(row['Current Market Value']):
                diff = row['Current Market Value'] - row['Purchase Price']
                profit_loss = f"${diff:+.2f}"

            location = row['Display Location'] if pd.notna(row['Display Location']) else ''

            values = (car_name, brand, series, year, color, condition,
                     purchase_price, market_value, profit_loss, location)

            self.tree.insert('', 'end', values=values, tags=(idx,))

        self.update_status(f"Loaded {len(df)} cars")
        self.update_statistics()

    def filter_collection(self):
        """Filter the collection based on search term."""
        search_term = self.search_var.get().lower()

        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)

        df = self.manager.df

        # Filter and populate
        for idx, row in df.iterrows():
            if pd.isna(row['Car Name']) or row['Car Name'] == '':
                continue

            # Check if search term matches any field
            row_text = ' '.join([str(val).lower() for val in row.values if pd.notna(val)])
            if search_term not in row_text:
                continue

            car_name = row['Car Name']
            brand = row['Brand'] if pd.notna(row['Brand']) else ''
            series = row['Series'] if pd.notna(row['Series']) else ''
            year = row['Year Released'] if pd.notna(row['Year Released']) else ''
            color = row['Color'] if pd.notna(row['Color']) else ''
            condition = row['Condition'] if pd.notna(row['Condition']) else ''

            purchase_price = f"${row['Purchase Price']:.2f}" if pd.notna(row['Purchase Price']) else ''
            market_value = f"${row['Current Market Value']:.2f}" if pd.notna(row['Current Market Value']) else ''

            profit_loss = ''
            if pd.notna(row['Purchase Price']) and pd.notna(row['Current Market Value']):
                diff = row['Current Market Value'] - row['Purchase Price']
                profit_loss = f"${diff:+.2f}"

            location = row['Display Location'] if pd.notna(row['Display Location']) else ''

            values = (car_name, brand, series, year, color, condition,
                     purchase_price, market_value, profit_loss, location)

            self.tree.insert('', 'end', values=values, tags=(idx,))

    def sort_column(self, col):
        """Sort treeview by column."""
        items = [(self.tree.set(item, col), item) for item in self.tree.get_children('')]
        items.sort()

        for index, (val, item) in enumerate(items):
            self.tree.move(item, '', index)

    def view_car_details(self):
        """View detailed information for selected car."""
        selection = self.tree.selection()
        if not selection:
            messagebox.showwarning("No Selection", "Please select a car to view details.")
            return

        item = selection[0]
        tags = self.tree.item(item, 'tags')
        if not tags:
            return

        idx = int(tags[0])
        car = self.manager.df.iloc[idx]

        # Create details window
        details_window = tk.Toplevel(self.root)
        details_window.title(f"Car Details - {car['Car Name']}")
        details_window.geometry("600x700")
        details_window.configure(bg=self.colors['white'])

        # Create scrollable text
        text = scrolledtext.ScrolledText(
            details_window,
            font=('Segoe UI', 10),
            padx=20,
            pady=20,
            wrap=tk.WORD
        )
        text.pack(fill='both', expand=True)

        # Display all fields
        text.insert('end', f"{car['Car Name']}\n", 'title')
        text.tag_config('title', font=('Segoe UI', 16, 'bold'),
                       foreground=self.colors['primary'])

        text.insert('end', '\n' + '='*60 + '\n\n')

        for col in self.manager.df.columns:
            if pd.notna(car[col]) and car[col] != '':
                text.insert('end', f"{col}:\n", 'label')
                text.insert('end', f"  {car[col]}\n\n")

        text.tag_config('label', font=('Segoe UI', 10, 'bold'))
        text.config(state='disabled')

    def delete_selected_car(self):
        """Delete the selected car from collection."""
        selection = self.tree.selection()
        if not selection:
            messagebox.showwarning("No Selection", "Please select a car to delete.")
            return

        item = selection[0]
        car_name = self.tree.item(item, 'values')[0]

        if messagebox.askyesno("Confirm Delete",
                              f"Are you sure you want to delete '{car_name}' from your collection?"):
            tags = self.tree.item(item, 'tags')
            if tags:
                idx = int(tags[0])
                self.manager.df = self.manager.df.drop(idx).reset_index(drop=True)

                # Save to Excel immediately
                if self.manager.save_collection():
                    self.update_status(f"Deleted {car_name} and saved")
                    messagebox.showinfo("Success", f"Deleted {car_name} and saved to spreadsheet")
                else:
                    self.update_status(f"Deleted {car_name} (not saved)")
                    messagebox.showwarning("Partial Success",
                                          f"Deleted {car_name} but failed to save to spreadsheet.\n"
                                          "Please use 'Save Collection' button to save manually.")

                self.refresh_collection_view()

    def add_car_from_form(self):
        """Add a new car from the form."""
        # Get car name (required)
        car_name_widget = self.add_car_fields['car_name']
        car_name = car_name_widget.get() if hasattr(car_name_widget, 'get') else car_name_widget.get('1.0', 'end-1c')
        car_name = car_name.strip()

        if not car_name:
            messagebox.showerror("Error", "Car Name is required!")
            return

        # Collect all field values
        new_row = {col: None for col in self.manager.df.columns}

        # Map form fields to dataframe columns
        field_mapping = {
            'car_name': 'Car Name',
            'brand': 'Brand',
            'series': 'Series',
            'year': 'Year Released',
            'model_number': 'Model Number',
            'color': 'Color',
            'purchase_price': 'Purchase Price',
            'purchased_from': 'Purchased From',
            'purchase_location': 'Purchase Location',
            'condition': 'Condition',
            'paint_condition': 'Paint Condition',
            'wheel_condition': 'Wheel Condition',
            'display_location': 'Display Location',
            'notes': 'Notes'
        }

        for form_key, col_name in field_mapping.items():
            if form_key in self.add_car_fields:
                widget = self.add_car_fields[form_key]
                if isinstance(widget, tk.Text):
                    value = widget.get('1.0', 'end-1c').strip()
                else:
                    value = widget.get().strip()

                if value:
                    # Special handling for purchase price
                    if col_name == 'Purchase Price':
                        try:
                            value = float(value)
                        except ValueError:
                            messagebox.showerror("Error", "Purchase Price must be a number!")
                            return

                    new_row[col_name] = value

        # Add date acquired
        new_row['Date Acquired'] = datetime.now().strftime("%Y-%m-%d")

        # Add to dataframe
        self.manager.df = pd.concat([self.manager.df, pd.DataFrame([new_row])], ignore_index=True)

        # Save to Excel immediately
        if self.manager.save_collection():
            messagebox.showinfo("Success", f"Added {car_name} to collection and saved to spreadsheet!")
            self.update_status(f"Added and saved {car_name}")
        else:
            messagebox.showwarning("Partial Success",
                                  f"Added {car_name} to collection but failed to save to spreadsheet.\n"
                                  "Please use 'Save Collection' button to save manually.")
            self.update_status(f"Added {car_name} (not saved)")

        self.clear_add_form()
        self.refresh_collection_view()

        # Ask about price update
        if messagebox.askyesno("Update Price",
                              "Would you like to check the current market price on eBay?"):
            self.notebook.select(2)  # Switch to price update tab
            self.single_car_index.set(str(len(self.manager.df) - 1))

    def clear_add_form(self):
        """Clear all fields in the add car form."""
        for widget in self.add_car_fields.values():
            if isinstance(widget, tk.Text):
                widget.delete('1.0', 'end')
            else:
                widget.delete(0, 'end')

    def set_manual_price(self):
        """Manually set the market price for a car."""
        try:
            idx = int(self.manual_car_index.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid car index!")
            return

        if idx < 0 or idx >= len(self.manager.df):
            messagebox.showerror("Error", f"Invalid index! Must be between 0 and {len(self.manager.df)-1}")
            return

        try:
            price = float(self.manual_price.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid price!")
            return

        if price < 0:
            messagebox.showerror("Error", "Price cannot be negative!")
            return

        # Update the dataframe
        car = self.manager.df.iloc[idx]
        car_name = car['Car Name']

        self.manager.df.at[idx, 'Current Market Value'] = price
        self.manager.df.at[idx, 'Last Appraisal Date'] = datetime.now().strftime("%Y-%m-%d")
        self.manager.df.at[idx, 'Source of Valuation'] = "Manual Entry"

        # Calculate appreciation if purchase price exists
        if pd.notna(car['Purchase Price']) and car['Purchase Price'] > 0:
            appreciation = ((price - car['Purchase Price']) / car['Purchase Price']) * 100
            self.manager.df.at[idx, 'Estimated Appreciation (%)'] = appreciation

        # Save to Excel
        if self.manager.save_collection():
            messagebox.showinfo("Success",
                              f"Set market price for {car_name} to ${price:.2f} and saved!")
            self.update_status(f"Set price for {car_name} and saved")
        else:
            messagebox.showwarning("Partial Success",
                                  f"Set market price for {car_name} but failed to save.\n"
                                  "Please use 'Save Collection' button to save manually.")
            self.update_status(f"Set price for {car_name} (not saved)")

        # Clear the fields
        self.manual_car_index.set("")
        self.manual_price.set("")

        # Refresh view
        self.refresh_collection_view()

    def update_single_price(self):
        """Update price for a single car."""
        try:
            idx = int(self.single_car_index.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid car index!")
            return

        if idx < 0 or idx >= len(self.manager.df):
            messagebox.showerror("Error", f"Invalid index! Must be between 0 and {len(self.manager.df)-1}")
            return

        self.single_progress_text.delete('1.0', 'end')
        self.update_status("Updating price...")

        # Temporarily set log callback to single progress
        original_callback = self.manager.log_callback
        self.manager.log_callback = self.log_single_progress

        def update_thread():
            try:
                self.manager.update_single_car_price(idx)
                self.log_single_progress(f"\n[OK] Price updated successfully!\n")

                # Save to Excel
                self.log_single_progress(f"\nSaving to spreadsheet...\n")
                if self.manager.save_collection():
                    self.log_single_progress(f"[OK] Saved to spreadsheet!\n")
                    self.root.after(0, lambda: self.update_status("Price updated and saved"))
                else:
                    self.log_single_progress(f"[X] Failed to save to spreadsheet\n")
                    self.root.after(0, lambda: self.update_status("Price updated (not saved)"))

                self.root.after(0, self.refresh_collection_view)
            except Exception as e:
                self.log_single_progress(f"\n[X] Error: {e}\n")
            finally:
                # Restore original callback
                self.manager.log_callback = original_callback

        thread = threading.Thread(target=update_thread, daemon=True)
        thread.start()

    def update_all_prices(self):
        """Update prices for all cars."""
        if not messagebox.askyesno("Confirm",
                                   f"This will update prices for {len(self.manager.df)} cars.\n"
                                   "This may take several minutes. Continue?"):
            return

        self.progress_text.delete('1.0', 'end')
        self.update_status("Updating all prices...")
        self.log_progress("="*60 + "\n")
        self.log_progress("  BATCH PRICE UPDATE STARTED\n")
        self.log_progress("="*60 + "\n")
        self.log_progress(f"Total cars to process: {len(self.manager.df)}\n")
        self.log_progress("Progress will appear below as each car is processed...\n")
        self.log_progress("="*60 + "\n\n")

        def update_thread():
            updated = 0
            failed = 0

            for idx, row in self.manager.df.iterrows():
                if pd.isna(row['Car Name']) or row['Car Name'] == '':
                    continue

                self.log_progress(f"\n>>> [{idx + 1}/{len(self.manager.df)}] {row['Car Name']}\n")

                try:
                    self.manager.update_single_car_price(idx)
                    updated += 1
                    import time
                    time.sleep(2)
                except Exception as e:
                    self.log_progress(f"  [X] Failed: {e}\n")
                    failed += 1

            self.log_progress("\n" + "="*60 + "\n")
            self.log_progress(f"  BATCH UPDATE COMPLETE!\n")
            self.log_progress("="*60 + "\n")
            self.log_progress(f"Successfully updated: {updated} cars\n")
            self.log_progress(f"Failed: {failed} cars\n")
            self.log_progress("="*60 + "\n\n")

            # Save to Excel
            self.log_progress(f"Saving all changes to spreadsheet...\n")
            if self.manager.save_collection():
                self.log_progress(f"[OK] All changes saved to spreadsheet!\n")
                self.root.after(0, lambda: self.update_status("All prices updated and saved"))
            else:
                self.log_progress(f"[X] Failed to save to spreadsheet\n")
                self.root.after(0, lambda: self.update_status("All prices updated (not saved)"))

            self.root.after(0, self.refresh_collection_view)

        thread = threading.Thread(target=update_thread, daemon=True)
        thread.start()

    def log_progress(self, message):
        """Log a message to the batch progress text widget."""
        def append():
            self.progress_text.insert('end', message)
            self.progress_text.see('end')

        self.root.after(0, append)

    def log_single_progress(self, message):
        """Log a message to the single car progress text widget."""
        def append():
            self.single_progress_text.insert('end', message)
            self.single_progress_text.see('end')

        self.root.after(0, append)

    def save_collection(self):
        """Save the collection to Excel."""
        if self.manager.save_collection():
            messagebox.showinfo("Success", "Collection saved successfully!")
            self.update_status("Collection saved")
        else:
            messagebox.showerror("Error", "Failed to save collection!")

    def update_statistics(self):
        """Update the statistics in the header."""
        df = self.manager.df

        # Total cars
        total_cars = len(df[df['Car Name'].notna()])
        self.stats_labels['total_cars'].config(text=str(total_cars))

        # Total invested
        total_invested = df['Purchase Price'].sum()
        if pd.notna(total_invested) and total_invested > 0:
            self.stats_labels['total_invested'].config(text=f"${total_invested:.2f}")
        else:
            self.stats_labels['total_invested'].config(text="--")

        # Market value
        total_value = df['Current Market Value'].sum()
        if pd.notna(total_value) and total_value > 0:
            self.stats_labels['market_value'].config(text=f"${total_value:.2f}")
        else:
            self.stats_labels['market_value'].config(text="--")

        # Profit/Loss
        if pd.notna(total_invested) and pd.notna(total_value) and total_invested > 0 and total_value > 0:
            profit = total_value - total_invested
            color = self.colors['success'] if profit >= 0 else self.colors['danger']
            self.stats_labels['profit_loss'].config(text=f"${profit:+.2f}", fg=color)
        else:
            self.stats_labels['profit_loss'].config(text="--", fg=self.colors['white'])

    def update_status(self, message):
        """Update the status bar message."""
        self.status_bar.config(text=message)


def main():
    """Main entry point for the GUI application."""
    root = tk.Tk()
    app = HotWheelsGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
