const fetch = require("node-fetch");
const db = require("./../models");
const { QueryTypes } = db.sequelize;

const fetchDataFromApi = async url => {
  try {
    let jsonData = [];

    const response = await fetch(url);

    if (response.ok) {
      jsonData = await response.json();
    } else {
      console.log("Error: ", response.statusText);
    }
    return jsonData;
  } catch (error) {
    errorHandler(error);
  }
};

const insertDataToDatabase = async data => {
  try {
    return await db.Petroleum.bulkCreate(data, {
      updateOnDuplicate: ["sale"],
    });
  } catch (error) {
    errorHandler(error);
  }
};

const getDateRange = async () => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const getDistinctProductNames = async () => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const createReport = async () => {
  try {
    let report = [];

    const petroleum_products = await getDistinctProductNames();

    const dateRange = await getDateRange();

    for (
      let productIndex = 0;
      productIndex < petroleum_products.length;
      productIndex++
    ) {
      const product = petroleum_products[productIndex];

      for (let dateIndex = 0; dateIndex < dateRange.length; dateIndex++) {
        const date = dateRange[dateIndex];

        const stat = await db.sequelize.query(
          "select min(sale) as minSale, max(sale) as maxSale, avg(sale) as avgSale from petroleums as petroleums where petroleums.petroleum_product = :product_name and (petroleums.year >= :minDate and petroleums.year <= :maxDate) and petroleums.sale > 0",
          {
            replacements: {
              product_name: product,
              minDate: date.lower,
              maxDate: date.upper,
            },
            type: QueryTypes.SELECT,
          }
        );

        report.push({
          Product: product,
          Year: `${date.lower} - ${date.upper}`,
          Min: stat[0].minSale ? stat[0].minSale : 0,
          Max: stat[0].maxSale ? stat[0].maxSale : 0,
          Avg: stat[0].avgSale ? stat[0].avgSale : 0,
        });
      }
    }

    return report;
  } catch (error) {
    errorHandler(error);
  }
};

const errorHandler = error => {
  console.log(`${error.name}: ${error.message}`);
};

module.exports = {
  fetchDataFromApi,
  insertDataToDatabase,
  getDateRange,
  getDistinctProductNames,
  createReport,
  errorHandler,
};
