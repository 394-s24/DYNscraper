// entries are
// "location Name": [
//     "address",
//     "city",
//     "state",
//     "zip",
//     "neighborhood",
//     "community",
//     "ward",
//     "phone number"
// ]

const addressDictionary = {
  "Indian Boundary YMCA": [
    "711 59th St",
    "Downers Grove",
    "IL",
    "60516",
    "",
    "",
    "",
    "(630) 968-8400",
  ],
  "Buehler YMCA": [
    "1400 W Northwest Hwy",
    "Palatine",
    "IL",
    "60067",
    "",
    "",
    "",
    "(847) 359-2400",
  ],
  "Crown Family YMCA": [
    "1030 W Van Buren St",
    "Chicago",
    "IL",
    "60607",
    "West Loop",
    "Near West Side",
    "28",
    "(312) 932-1200",
  ],
  "Elmhurst YMCA": [
    "211 W 1st St",
    "Elmhurst",
    "IL",
    "60126",
    "",
    "",
    "",
    "(630) 834-9200",
  ],
  "Foglia YMCA": [
    "1025 N Old McHenry Rd",
    "Lake Zurich",
    "IL",
    "60047",
    "",
    "",
    "",
    "(847) 438-5300",
  ],
  "Fry Family YMCA": [
    "2120 95th St",
    "Naperville",
    "IL",
    "60564",
    "",
    "",
    "",
    "(630) 904-9595",
  ],
  "Greater LaGrange YMCA": [
    "1100 E 31st St",
    "La Grange Park",
    "IL",
    "60526",
    "",
    "",
    "",
    "(708) 352-7600",
  ],
  "Hastings Lake YMCA": [
    "1995 W Grass Lake Rd",
    "Lindenhurst",
    "IL",
    "60046",
    "",
    "",
    "",
    "(847) 356-4006",
  ],
  "Irving Park YMCA": [
    "4251 W Irving Park Rd",
    "Chicago",
    "IL",
    "60641",
    "Irving Park",
    "Irving Park",
    "45",
    "(773) 777-7500",
  ],
  "Kelly Hall YMCA": [
    "824 N Hamlin Ave",
    "Chicago",
    "IL",
    "60651",
    "Humboldt Park",
    "Humboldt Park",
    "27",
    "(773) 886-1220",
  ],
  "Lake View YMCA": [
    "3333 N Marshfield Ave",
    "Chicago",
    "IL",
    "60657",
    "Lakeview",
    "Lake View",
    "44",
    "(773) 248-3333",
  ],
  "McCormick YMCA": [
    "1834 N Lawndale Ave",
    "Chicago",
    "IL",
    "60647",
    "Logan Square",
    "Logan Square",
    "32",
    "(773) 235-2525",
  ],
  "Rauner Family YMCA": [
    "2700 S Western Ave",
    "Chicago",
    "IL",
    "60608",
    "Little Village",
    "South Lawndale",
    "12",
    "(773) 847-3115",
  ],
  "Sage YMCA": [
    "701 Manor Rd",
    "Crystal Lake",
    "IL",
    "60014",
    "",
    "",
    "",
    "(815) 459-4455",
  ],
  "South Side YMCA": [
    "6330 S Stony Is Ave",
    "Chicago",
    "IL",
    "60637",
    "Woodlawn",
    "Woodlawn",
    "20",
    "(773) 947-0700",
  ],
  "YMCA Safe 'n Sound": [
    "2120 95th St",
    "Naperville",
    "IL",
    "60564",
    "",
    "",
    "",
    "(630) 585-2207",
  ],
};

const header = [
  "Folder_Name", // [0]
  "Program_Name", // [1]
  "Program_Description", // [2]
  "Logo_URL", // [3]
  "Category", // [4]
  "Program_Capacity", // [5]
  "Min_Age", // [6]
  "Max_Age", // [7]
  "Meeting_Type", // [8]
  "Location_Name", // [9]
  "Address", // [10]
  "City", // [11]
  "State", // [12]
  "Zipcode", // [13]
  "Program_URL", // [14]
  "Registration_URL", // [15]
  "Start_Date", // [16]
  "End_Date", // [17]
  "Start_Time", // [18]
  "End_Time", // [19]
  "Registration_Deadline", // [20]
  "Contact_Name", // [21]
  "Contact_Email", // [22]
  "Contact_Phone", // [23]
  "Price", // [24]
  "Extra_Data", // [25]
  "online_address", // [26]
  "dosage", // [27]
  "internal_id", // [28]
  "neighborhood", // [29]
  "community", // [30]
  "ward", // [31]
];

const categoriesMap = {
  "DC-Day Camp": { 
    "dyn_category_match": "Nature", 
    "dyn_category_number": 226 },
  "AQ-Aquatics": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "CC-Child Care": {
    "dyn_category_match": "Helping Your Community.",
    "dyn_category_number": 215,
  },
  "FM-Family Programming": {
    "dyn_category_match": "Helping Your Community.",
    "dyn_category_number": 215,
  },
  "OT-Other": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "PT-Personal Training": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "RE-Rentals": { 
    "dyn_category_match": "Customer/Human Service", 
    "dyn_category_number": 351 
  },
  "SR-Sports & Recreation": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "VP-Virtual Program": {
    "dyn_category_match": "Digital Media",
    "dyn_category_number": 225,
  },
  "YD-Youth Development": { 
    "dyn_category_match": "Work + Career", 
    "dyn_category_number": 222 
  },
  "HF-Health & Fitness": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "FH-Field House": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "R-Not defined": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
  "STR-Not defined": {
    "dyn_category_match": "Sports + Wellness.",
    "dyn_category_number": 231,
  },
};
export { addressDictionary, header, categoriesMap };
