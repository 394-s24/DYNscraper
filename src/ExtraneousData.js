// entries are 
// "location Name": [
//     "address",
//     "city",
//     "state",
//     "zip",
//     "neighborhood",
//     "community",
//     "ward",
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
    ],
    "Buehler YMCA": [
      "1400 W Northwest Hwy",
      "Palatine",
      "IL",
      "60067",
      "",
      "",
      "",
    ],
    "Crown Family YMCA": [
      "1030 W Van Buren St",
      "Chicago",
      "IL",
      "60607",
      "West Loop",
      "Near West Side",
      "28",
    ],
    "Elmhurst YMCA": [
      "211 W 1st St",
      "Elmhurst",
      "IL",
      "60126",
      "",
      "",
      "",
    ],
    "Foglia YMCA": [
      "1025 N Old McHenry Rd",
      "Lake Zurich",
      "IL",
      "60047",
      "",
      "",
      "",
    ],
    "Fry Family YMCA": [
      "2120 95th St",
      "Naperville",
      "IL",
      "60564",
      "",
      "",
      "",
    ],
    "Greater LaGrange YMCA": [
      "1100 E 31st St",
      "La Grange Park",
      "IL",
      "60526",
      "",
      "",
      "",
    ],
    "Hastings Lake YMCA": [
      "1995 W Grass Lake Rd",
      "Lindenhurst",
      "IL",
      "60046",
      "",
      "",
      "",
    ],
    "Irving Park YMCA": [
      "4251 W Irving Park Rd",
      "Chicago",
      "IL",
      "60641",
      "Irving Park",
      "Irving Park",
      "45",
    ],
    "Kelly Hall YMCA": [
      "824 N Hamlin Ave",
      "Chicago",
      "IL",
      "60651",
      "Humboldt Park",
      "Humboldt Park",
      "27",
    ],
    "Lake View YMCA": [
      "3333 N Marshfield Ave",
      "Chicago",
      "IL",
      "60657",
      "Lakeview",
      "Lake View",
      "44",
    ],
    "McCormick YMCA": [
      "1834 N Lawndale Ave",
      "Chicago",
      "IL",
      "60647",
      "Logan Square",
      "Logan Square",
      "32",
    ],
    "Rauner Family YMCA": [
      "2700 S Western Ave",
      "Chicago",
      "IL",
      "60608",
      "Little Village",
      "South Lawndale",
      "12",
    ],
    "Sage YMCA": [
      "701 Manor Rd",
      "Crystal Lake",
      "IL",
      "60014",
      "",
      "",
      "",
    ],
    "South Side YMCA": [
      "6330 S Stony Is Ave",
      "Chicago",
      "IL",
      "60637",
      "Woodlawn",
      "Woodlawn",
      "20",
    ],
    "YMCA Safe 'n Sound": [
      "2120 95th St",
      "Naperville",
      "IL",
      "60564",
      "",
      "",
      "",
    ],
  };

const header = [
    "Folder_Name",// [0]
    "Program_Name",// [1]
    "Program_Description",// [2]
    "Logo_URL",// [3]
    "Category",// [4]
    "Program_Capacity",// [5]
    "Min_Age",// [6]
    "Max_Age",// [7]
    "Meeting_Type",// [8]
    "Location_Name",// [9]
    "Address",// [10]
    "City",// [11]
    "State",// [12]
    "Zipcode",// [13]
    "Program_URL",// [14]
    "Registration_URL",// [15]
    "Start_Date",// [16]
    "End_Date",// [17]
    "Start_Time",// [18]
    "End_Time",// [19]
    "Registration_Deadline",// [20]
    "Contact_Name",// [21]
    "Contact_Email",// [22]
    "Contact_Phone",// [23]
    "Price",// [24]
    "Extra_Data",// [25]
    "online_address",// [26]
    "dosage",// [27]
    "internal_id",// [28]
    "neighborhood",// [29]
    "community",// [30]
    "ward",// [31]
  ];
export { addressDictionary, header };
