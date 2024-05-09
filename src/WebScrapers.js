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
      const event_title = await event.querySelector(".program-desc__title");

      const event_rows = await event.querySelectorAll(
        ".program-table tbody tr"
      );

      for (const data of event_rows) {
        let entry = {};

        entry["Title"] = event_title.innerText;

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
                entry["Start Date"] = dates[0].split(" ")[1];
                entry["End Date"] = dates[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
              }
            } else if (event_data_label.innerText === "Time") {
              try {
                let times = event_data_value.innerHTML.split("<br>");
                entry["Start Time"] = times[0].split(" ")[1];
                entry["End Time"] = times[1].split(" ")[1];
              } catch (err) {
                console.log("error is ", err);
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

  return programs;
};



export { YMCAscraper };
