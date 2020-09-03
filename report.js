const fetch = require("node-fetch");
const db = require("./models");
const { QueryTypes } = db.sequelize;

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

      const report = await createReport();
    } else {
      console.log("Error: ", response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
})(dataUrl);

const createReport = async () => {
  let report = [];

  const petroleum_products = await getDistinctProductNames();
  console.log("product names", petroleum_products);

  const dateRange = await getDateRange();
  console.log("date range", dateRange);

  return report;
};

const getDateRange = async () => {
  const dates = await db.sequelize.query(
    "select min(year) as minDate, max(year) as maxDate from petroleums",
    {
      type: QueryTypes.SELECT,
    }
  );

  const minDate = parseInt(dates[0].minDate);
  const maxDate = parseInt(dates[0].maxDate);

  let dateRange = [];

  for (let date = maxDate; date > minDate; date = date - 5) {
    dateRange.push({ lower: date - 4, upper: date });
  }

  return dateRange;
};

const getDistinctProductNames = async () => {
  const results = await db.Petroleum.findAll({
    attributes: [
      db.Sequelize.fn("DISTINCT", db.Sequelize.col("petroleum_product")),
      "petroleum_product",
    ],
  });

  const petroleum_products = results.map(result => {
    resultJson = result.toJSON();
    return resultJson.petroleum_product;
  });

  return petroleum_products;
};
