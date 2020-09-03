const fetch = require("node-fetch");
const db = require("./models");

const dataUrl =
  "https://raw.githubusercontent.com/younginnovations/internship-challenges/master/programming/petroleum-report/data.json";

(async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      console.log(jsonData);

      const data = await db.Petroleum.bulkCreate(jsonData, {
        updateOnDuplicate: ["sale"],
      });
    } else {
      console.log("Error: ", response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
})(dataUrl);
