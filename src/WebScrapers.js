const YMCAscraper = async (url) => {
  console.log("url is ", url);
  console.log("running YMCA web scraper");
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url); // fixing cors error using this
  const response = await fetch(proxyUrl);
  const programs_scraped = [];
  if (!response.ok) {
    alert(response.statusText);
  } else {
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const programs = doc.querySelectorAll(
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

        const program_data = data.querySelectorAll("td");

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
