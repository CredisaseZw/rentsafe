const e=["Agriculture","Banking","Construction","Education","Energy","Entertainment","Finance","Food","Health","Hospitality","Insurance","Manufacturing","Media","Retail","Technology","Telecommunications","Transportation","Aviation","Real Estate","Other"],c=[{category:"Exterior",items:["Back Doors","Deck, veranda, patio","Doorbell Soffits and fascia","Front Doors","Garage Doors","Garbage receptacle","House number","Mailbox","Outdoor lights","Paint and trim","Parking","Recycling receptacle","Sidewalks","Siding (brick/stone/cement)","Traffic noise","Windows"],description:"Are things loose, cracked, damaged, rotted, bug infested?"},{category:"Roof",items:["Chimney","Gutters and downspouts","Soffits and fascia"],description:"When was it replaced last? Are there encroaching trees?"},{category:"Garage",items:["Ceiling","Doors","Floors","Lights","Storage","Walls","Windows"],description:"Is the garage door opener operating properly?"},{category:"Yard",items:["Drainage","Fences and Gates","Retaining Wall","Shed","Water Tanks","Borehole","Swimming Pool"],description:"Trees, shrubs and lawn dead, dying or bug infested?"},{category:"Blockages",items:["Carbon Monoxide Detector","Mantle","Soot","Tiles"],description:"Any buildup inside? Damage where connected to roof?"},{category:"Bathrooms",subCategories:["Bathroom 1","Bathroom 2","Bathroom 3"],items:["Baseboards","Cabinets, shelves, & drawers","Ceiling","Counter","Doors","Floors","Shower","Lights","Mirror","Outlets and Switches","Sink","Toilet","Towel Hook","Trim","Tub","Walls","Window"],description:"Fixtures secure? Condition of tiles and calking? Leaks or water pressure issues? Mold? Drawers and cabinets working?"},{category:"Bedrooms",subCategories:["Bedroom 1","Bedroom 2","Bedroom 3"],items:["Baseboards","Ceiling","Closet","Doors","Floors","Lights","Outlets and switches","Trim","Walls","Windows"],description:"Check ceilings for sloping and/or water damage. Are floors weak in places? Damaged windows or window screens?"},{category:"Dining Room",items:["Baseboards","Ceiling","Floors","Lights","Outlets and switches","Trim","Walls","Windows"],description:"Wall damage? Sloping ceiling? Weak floors?"},{category:"Lounge",items:["Baseboards","Ceiling","Ceiling fAN","Doors","Floors","Lights","Outlets and switches","Trim","Walls","Windows"],description:"Wall damage? Sloping ceiling? Weak floors?"},{category:"Kitchen",items:["Baseboards","Shelves and Cupboard","Ceiling","Counter","Dishwasher","Floors","Garbage Disposal","Lights","Outlets and switches","Oven","Refrigerator","Sink","Smoke Detectors","Stove","Trim","Walls","Windows"],description:"Leaking sink or appliances? Cabinet & drawer condition?"},{category:"Pantry",items:["Baseboards","Ceiling","Shelves and Cupboard","Doors","Floors","Lights","Outlets and switches","Trim","Walls","Windows"],description:"Wall damage? Sloping ceiling? Weak floors?"},{category:"Attic",items:["Insulation","Ladder","Ventilation"],description:"Leaks, water damage, mold? Sufficient insulation?"},{category:"Hallways",items:["Baseboards","Ceiling","Closets","Floors","Lights","Outlets and switches","Skylights","Trim","Walls"],description:"Wall damage? Sloping ceiling? Weak floors?"},{category:"Basement",items:["Baseboards","Ceiling","Doors","Floors","Foundation","Lights","Outlets and switches","Stairs","Storage","Sump pump","Trim","Walls","Washer and dryer","Windows"],description:"Damp, musty or moldy? Beam damage? Bugs?"},{category:"Stairs",items:["Floors","Landing","Lights","Railing","Treads","Walls"],description:"Weak stairs? Railings available and secure?"},{category:"Utilities",items:["Air conditioning","Circuit Breakers","Drainage","Solar","Gyser","Main Electrical Panel","Water Pressure"],description:"Functioning properly? Are they new or old?"},{category:"Other",items:["Asbestos","Odor","Wood-eating insects"],description:"Smoke and carbon monoxide detectors in place?"}],t=[{code:"S1",sector:"Sales"},{code:"S2",sector:"Cost of Sales"},{code:"S3",sector:"Direct expenses"},{code:"S4",sector:"Other income"},{code:"S5",sector:"Expenses"},{code:"S6",sector:"Fixed Assets"},{code:"S7",sector:"Investments"},{code:"S8",sector:"Current Assets"},{code:"S9",sector:"Equity & Reserves"},{code:"S10",sector:"Long Term Liabilities"},{code:"S11",sector:"Current Liabilities"}],o=[{accountName:"Sales",accountNumber:"10000",accountsSector:"S1",sectorName:"Sales"},{accountName:"Other income",accountNumber:"11000",accountsSector:"S4",sectorName:"Other income"},{accountName:"Cost of sales",accountNumber:"20000",accountsSector:"S2",sectorName:"Cost of Sales"},{accountName:"Direct Expenses",accountNumber:"21000",accountsSector:"S3",sectorName:"Direct expenses"},{accountName:"Accounting / Audit Fees",accountNumber:"30010",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Advertising & Promotions",accountNumber:"30020",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Amortisation",accountNumber:"30030",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Bad Debts",accountNumber:"30040",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Bank Charges",accountNumber:"30050",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Computer Expenses",accountNumber:"30060",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Consultancy",accountNumber:"30070",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Depreciation",accountNumber:"30080",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Elecricity and water",accountNumber:"30090",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Finance charges",accountNumber:"30100",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Fuel and oils",accountNumber:"30110",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Insurance",accountNumber:"30120",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Internet & Email",accountNumber:"30130",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Legal Fees",accountNumber:"30140",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Meeting expenses",accountNumber:"30150",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Miscellaneous Expenses",accountNumber:"30160",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Motor Vehicle repairs and maintenance",accountNumber:"30170",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Pension contributions",accountNumber:"30180",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Parking",accountNumber:"30190",accountsSector:"S5",sectorName:"Expenses"},{accountName:"PAYE",accountNumber:"30200",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Printing & Stationery",accountNumber:"30210",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Profit/(Loss) on foreign exchange",accountNumber:"30220",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Rates",accountNumber:"30230",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Rent",accountNumber:"30240",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Repairs & Maintenance",accountNumber:"30250",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Salaries & Wages",accountNumber:"30260",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Staff Training",accountNumber:"30270",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Staff Welfare",accountNumber:"30280",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Subscriptions",accountNumber:"30290",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Teas & Cleaning",accountNumber:"30300",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Telephone Costs",accountNumber:"30310",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Travel Costs external",accountNumber:"30320",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Travel costs internal",accountNumber:"30330",accountsSector:"S5",sectorName:"Expenses"},{accountName:"Cost - Fixed Assets",accountNumber:"40010",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Cost - Computers",accountNumber:"40020",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Cost - Furniture & Fittings",accountNumber:"40030",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Cost - Land & Buildings",accountNumber:"40040",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Cost - Motor Vehicles",accountNumber:"40050",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Cost - Office Equipment",accountNumber:"40060",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Fixed Assets",accountNumber:"41010",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Computers",accountNumber:"41020",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Furniture & Fittings",accountNumber:"41030",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Land & Buildings",accountNumber:"41040",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Motor Vehicles",accountNumber:"41050",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Accumulated Depreciation - Office Equipment",accountNumber:"41060",accountsSector:"S6",sectorName:"Fixed Assets"},{accountName:"Investments",accountNumber:"50010",accountsSector:"S7",sectorName:"Investments"},{accountName:"Petty-Cash",accountNumber:"60010",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Bank",accountNumber:"60020",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Trade debtors",accountNumber:"60030",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Prepayments",accountNumber:"60040",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Stock",accountNumber:"60050",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Other current assets",accountNumber:"60060",accountsSector:"S8",sectorName:"Current Assets"},{accountName:"Share Capital",accountNumber:"70010",accountsSector:"S9",sectorName:"Equity & Reserves"},{accountName:"Retained Income",accountNumber:"70020",accountsSector:"S9",sectorName:"Equity & Reserves"},{accountName:"Long term loans",accountNumber:"80010",accountsSector:"S10",sectorName:"Long Term Liabilities"},{accountName:"Trade creditors",accountNumber:"90010",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"Accruals",accountNumber:"90020",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"Provisions",accountNumber:"90030",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"Other current liabilities",accountNumber:"90040",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"VAT Control Account",accountNumber:"90050",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"Income Tax",accountNumber:"90060",accountsSector:"S11",sectorName:"Current Liabilities"},{accountName:"Suspense account",accountNumber:"99999",accountsSector:"S11",sectorName:"Current Liabilities"}];export{o as a,t as b,e as i,c as r};
