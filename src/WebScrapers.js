const YMCAscraper = async (url) => {
  console.log("url is ", url);
  console.log("running YMCA web scraper");
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url); // fixing cors error using this
  const response = await fetch(proxyUrl); // getting html from website
  const programs_scraped = [];
  if (!response.ok) {
    alert(response.statusText);
  } else {
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html"); //making sure we get stuff, and parsing. making sure html is there
    const programs = doc.querySelectorAll( //going thru html
      ".section-container .section-container"
    );

    for (const program of programs) {
      const program_title = await program.querySelector(".program-desc__title");

      let program_description_data = await program
        .querySelector(".program-desc__content")
        .innerText.split("\n");

      let address = null;
      let description = "";
      let contact = null;

      for (const data of program_description_data) {
        // if we aren't just looking at whitespace
        if (data.trim().length !== 0) {
          if (data.includes("Location")) {
            address = data.split(":")[1].trim();
          } else if (data.includes("Contact:")) {
            contact = data.split(":")[1].trim();
          } else {
            description = description.concat(data.trim() + " ");
          }
        }
      }

      let city = null;
      let state = null;
      let zip = null;

      //break down the address
      if (address) {
        let address_components = address.split(",");

        // this should be the address
        address = address_components[0].trim();

        // this should be the city
        city = address_components[1].trim();

        // this should be the state and zip so we break it down further
        let state_zip = address_components[2].trim().split(" ");

        // this should be the state
        state = state_zip[0];

        // this should be the zip
        zip = state_zip[1];
      }

      // a single program can have multiple sections
      // (aka multiple offerings of the same program)
      const sections = await program.querySelectorAll(
        ".program-table tbody tr"
      );

      for (const data of sections) {
        let entry = {};

        entry["Title"] = program_title.innerText;

        entry["Description"] = description;

        if (address) {
          entry["Address"] = address;
          entry["City"] = city;
          entry["State"] = state;
          entry["Zipcode"] = zip;
        }

        contact ? (entry["Contact"] = contact) : null;

        const program_data = data.querySelectorAll("td"); // gets date,time,age,cost

        for (let i = 0; i < program_data.length; i++) {
          const program_data_label = await program_data[i].querySelector(
            ".program-table__cell-label"
          );

          const program_data_value = await program_data[i].querySelector(
            "td .program-table__cell-content"
          );

          if (program_data_label && program_data_value) {
            if (program_data_label.innerText === "Date") {
              let dates = program_data_value.innerHTML.split("<br>");
              try {
                entry["Start_Date"] = dates[0].split(" ")[1];
                entry["End_Date"] = dates[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (program_data_label.innerText === "Time") {
              try {
                let times = program_data_value.innerHTML.split("<br>");
                entry["Start_Time"] = times[0].split(" ")[1];
                entry["End_Time"] = times[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (program_data_label.innerText === "Day") {
              try {
                let days = program_data_value.innerHTML.replaceAll(
                  "<br>",
                  ", "
                );
                entry["Day"] = days;
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (program_data_label.innerText === "Age") {
              const age_breakdown = program_data_value.innerText.split("-");
              if (age_breakdown.length === 2) {
                entry["Min_Age"] = age_breakdown[0].trim();
                entry["Max_Age"] = age_breakdown[1].trim();
              }
            } else if (program_data_label.innerText === "Cost") {
              let cost_html = program_data_value;
              const cost_details = await cost_html.querySelectorAll("span");
              for (const cost_detail of cost_details) {
                if (cost_detail.innerText.includes("Non-Member")) {
                  entry["Non_Member_Cost"] =
                    cost_detail.innerText.split(":")[1];
                  1;
                } else if (cost_detail.innerText.includes("Member")) {
                  entry["Member_Cost"] = cost_detail.innerText.split(":")[1];
                } else if (cost_detail) {
                  entry["Cost_additional_info"]
                    ? (entry["Cost_additional_info"] +=
                        " " + cost_detail.innerText)
                    : (entry["Cost_additional_info"] = cost_detail.innerText);
                }
              }
            } else if (program_data_label.innerText === "ID") {
              let ID = program_data_value.querySelector(
                ".program-table__reveal-content"
              ).innerText;
              entry["internal_id"] = ID;
              entry["program_url"] = "https://www.ymcachicago.org/program-search/?keywords=" + ID;
             } else if (program_data_label.innerText === "Location") {
                const addressDictionary = {"Indian Boundary YMCA": ['711 59th St', 'Downers Grove','IL','60516'], 
                "Buehler YMCA": ['1400 W Northwest Hwy', 'Palatine','IL','60067'],
                "Crown Family YMCA": ['1030 W Van Buren St', 'Chicago','IL','60067'],
                "Buehler YMCA": ['1400 W Northwest Hwy', 'Palatine','IL','60067'],
                "Elmhurst YMCA": ['211 W 1st St', 'Elmhurst','IL','60126'],
                "Foglia YMCA": ['1025 N Old McHenry Rd', 'Lake Zurich','IL','60047'],
                "Fry Family YMCA": ['2120 95th St', 'Naperville','IL','60564'],
                "Greater LaGrange YMCA": ['1100 E 31st St', 'La Grange Park','IL','60526'],
                "Hastings Lake YMCA": ['1995 W Grass Lake Rd', 'Lindenhurst','IL','60046'],
                "Irving Park YMCA": ['4251 W Irving Park Rd', 'Chicago','IL','60641'],
                "Kelly Hall YMCA": ['824 N Hamlin Ave', 'Chicago','IL','60651'],
                "Lake View YMCA": ['3333 N Marshfield Ave', 'Chicago','IL','60657'],
                "McCormick YMCA": ['1834 N Lawndale Ave', 'Chicago','IL','60647'],
                "Rauner Family YMCA": ['2700 S Western Ave', 'Chicago','IL','60608'],
                "Sage YMCA": ['701 Manor Rd', 'Crystal Lake','IL','60014'],
                "South Side YMCA": ['6330 S Stony Is Ave', 'Chicago','IL','60637'],
                "YMCA Safe 'n Sound": ['2120 95th St', 'Naperville','IL','60564']
              }
                try {const addressData = program_data_value.innerText
                  entry["Address"] = addressDictionary[addressData][0]
                  entry["City"] = addressDictionary[addressData][1]
                  entry["State"] = addressDictionary[addressData][2]
                  entry["Zipcode"] = addressDictionary[addressData][3]
                  entry["Location"] = program_data_value.innerText
                }
                  catch{
                    entry["Location"] = program_data_value.innerText
                  }
                
            
            } else {
              entry[program_data_label.innerText] =
                program_data_value.innerHTML;
            }
          }
        }

        programs_scraped.push(entry);
      }
    }
  }

  console.log("programs are ", programs_scraped);
  return programs_scraped;
};

export { YMCAscraper };
