const YMCAscraper = async (url) => {
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url); // fixing cors error using this
  const response = await fetch(proxyUrl);
  const programs = [];
  if (!response.ok) {
    alert(response.statusText);
  } else {
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const events = doc.querySelectorAll(
      ".section-container .section-container"
    );

    for (const event of events) {
      //console.log("event is ", event);
      const event_title = await event.querySelector(".program-desc__title");

      let event_description_data = await event.querySelector(
        ".program-desc__content"
      );

      let event_description_list = event_description_data.innerText.split("\n");

      //console.log(event_description_list);

      let address = null;

      let city = null;

      let state = null;

      let zip = null;

      let description = "";

      let contact = null;

      for (const data of event_description_list) {
        // if we aren't just looking at whitespace
        if (data.trim().length !== 0) {
          if (data.includes("Location")) {
            address = data.split(":")[1].trim();
          } else if (data.includes("Contact:")) {
            contact = data.split(":")[1].trim();
          } else {
            description += data;
          }
        }
      }

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

      const event_rows = await event.querySelectorAll(
        ".program-table tbody tr"
      );

      for (const data of event_rows) {
        let entry = {};

        entry["Title"] = event_title.innerText;

        entry["Description"] = description;

        if (address) {
          entry["Address"] = address;
          entry["City"] = city;
          entry["State"] = state;
          entry["Zipcode"] = zip;
        }

        contact ? (entry["Contact"] = contact) : null;

        const event_data = data.querySelectorAll("td");

        for (let i = 0; i < event_data.length; i++) {
          const event_data_label = await event_data[i].querySelector(
            ".program-table__cell-label"
          );

          const event_data_value = await event_data[i].querySelector(
            "td .program-table__cell-content"
          );

          if (event_data_label && event_data_value) {
            if (event_data_label.innerText === "Date") {
              let dates = event_data_value.innerHTML.split("<br>");
              try {
                entry["Start_Date"] = dates[0].split(" ")[1];
                entry["End_Date"] = dates[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (event_data_label.innerText === "Time") {
              try {
                let times = event_data_value.innerHTML.split("<br>");
                entry["Start_Time"] = times[0].split(" ")[1];
                entry["End_Time"] = times[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (event_data_label.innerText === "Day") {
              try {
                let days = event_data_value.innerHTML.replaceAll("<br>", ", ");
                entry["Day"] = days;
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (event_data_label.innerText === "Age") {
              const age_breakdown = event_data_value.innerText.split("-");
              if (age_breakdown.length === 2) {
                entry["Min_Age"] = age_breakdown[0].trim();
                entry["Max_Age"] = age_breakdown[1].trim();
              }
            } else if (event_data_label.innerText === "Cost") {
              let cost_html = event_data_value;
              const cost_details = await cost_html.querySelectorAll("span")
              for (const cost_detail of cost_details) {
                //console.log("cost detail is ", cost_detail.innerText);
                if (cost_detail.innerText.includes("Member")) {
                  entry["Member_Cost"] = cost_detail.innerText.split(":")[1];
                } else if (cost_detail.innerText.includes("Non-Member")) {
                  entry["Non_Member_Cost"] = cost_detail.innerText.split(":")[1];
                }
              }
            } else {
              entry[event_data_label.innerText] = event_data_value.innerHTML;
            }
          }
        }
        programs.push(entry);
      }
    }
  }

  console.log("programs are ", programs);

  //console.log("example description is", programs[0]["Description"]);

  return programs;
};

export { YMCAscraper };
