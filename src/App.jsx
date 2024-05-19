import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { YMCAscraper } from "./WebScrapers.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
// sheetJS import
import { writeFile, utils, read, writeFileXLSX } from "xlsx";

const App = () => {
  const [urlValue, setUrlValue] = useState("");
  const [scrapingData, setScrapingData] = useState([{}]);
  const [resultFile, setResultFile] = useState(null);
  const [urlError, setUrlError] = useState("");

  var file;

  // based on https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
  // const data = "foo,bar,\nfi,fie,fo,fum";
  //  console.log("testing download");
  // const file = new File([data], "new-note.csv", {
  //   type: "text/csv",
  // });

  // proof of concept from Riesbeck for fetching data from a website
  async function test() {
    var data;
    const url =
      "https://www.ymcachicago.org/program-search/?locations=LV&locations=MT&locations=SS&programs=AQ-Aquatics&keywords=";
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url); // fixing cors error using this
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      alert(response.statusText);
    } else {
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const firstEventTitle = doc.querySelector(
        ".section-container .section-container .program-desc__title"
      ).innerText;
      console.log(firstEventTitle);
    }
  }

  function download() {
    if (resultFile) {
      console.log("file exists")
      var wb = utils.book_new();
      utils.book_append_sheet(wb, resultFile, "Sheet1");
      writeFile(wb, "SheetJSExportAOA.csv");
    } else {
      console.log("error try again")
      console.log(file)
      console.log("file does not exist?")
    }
    
  }

  const getData = async (event) => {
    event.preventDefault();

    if (urlValue.includes("ymca")) {
      // hide button so we can't click in middle
      if (document.getElementById("download-button").style.display == "inline") {
        document.getElementById("download-button").style.display = "none";
      }
      var sdata = await YMCAscraper(urlValue);
      console.log(sdata)
      setScrapingData(sdata)

      var fileData = Array();
      // const header = "Folder_Name,Program_Name,Program_Description,Logo_URL,Category,Program_Capacity,Min_Age,Max_Age,Meeting_Type,Location_Name,Address,City,State,Zipcode,Program_URL,Registration_URL,Start_Date,End_Date,Start_Time,End_Time,Registration_Deadline,Contact_Name,Contact_Email,Contact_Phone,Price,Extra_Data,online_address,dosage,internal_id,neighborhood,community,ward";
      const header = ["Folder_Name","Program_Name","Program_Description","Logo_URL","Category","Program_Capacity","Min_Age","Max_Age","Meeting_Type","Location_Name","Address","City","State","Zipcode","Program_URL","Registration_URL","Start_Date","End_Date","Start_Time","End_Time","Registration_Deadline","Contact_Name","Contact_Email","Contact_Phone","Price","Extra_Data","online_address","dosage","internal_id","neighborhood","community","ward"];


      for (var key in sdata) {
        var item = sdata[key];
      // sdata.forEach((item) => {
        var row = Array(32).fill("");
        // row[1] = "\"" + item["Title"].replaceAll(",", "\,").replaceAll(/"/g, '\"') + "\"";
        row[1] = item["Title"];
        // row[2] = "\"" + item["Description"].replaceAll(",", "\,").replaceAll(/"/g, '\"') + "\"";
        row[2] = item["Description"];
        row[5] = item["Spots Remaining"].split("of")[1].trim();
        row[6] = item["Min_Age"];
        row[7] = item["Max_Age"];
        row[9] = item["Location"];
        row[10] = item["Address"];
        row[11] = item["City"];
        row[12] = item["State"];
        row[13] = item["Zipcode"];
        row[14] = item["program_url"];
        row[16] = item["Start_Date"];
        row[17] = item["End_Date"];
        row[18] = item["Start_Time"];
        row[19] = item["End_Time"];
        row[24] = "Member cost " + item["Member_Cost"] + " Non-member cost " + item["Non_Member_Cost"];
        row[28] = item["internal_id"];
        row[28] = item["neighborhood"];
        row[28] = item["community"];
        row[28] = item["ward"];
        // fileData.push(row.toString() + "\n");
        fileData.push(row);
        // 
      }

      fileData.unshift(header);
      var ws = utils.aoa_to_sheet(fileData, {bookType: 'xlsx', type: 'string'});
      setResultFile(ws);

      if (ws) {
        // unhide download button
        document.getElementById("download-button").style.display = "inline";
        console.log("file created")
        
      }

      setUrlError("");
      
    }
    else{
      setUrlError("This url type is not supported. Please enter a valid YMCA Program Search URL.")
    }
  }

  let error = <br/>

  if (urlError != "") {
    error = <p style = {{color:"red"}}>{urlError}</p>
  }
  else {
    error = <br/>
  }

  return (
    <div className="App">
      <h1>DYNscraper</h1>
      <br />
      <form onSubmit={(e) => getData(e)}>
        <p>Enter YMCA Program Search URL</p>
        <input type="url" value = {urlValue}  onChange = {(e) => setUrlValue(e.target.value)} required/>
        {error}
        <Button type="submit" style={{margin: '5px' }}>Get Data</Button>
        <br />
        <Button id="download-button" onClick={download} style={{ display: 'none', margin: '5px' }}>Download CSV</Button>
      </form>
    </div>
  );
};

export default App;
