process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;

const db = require("./../models/");

const {
  fetchDataFromApi,
  insertDataToDatabase,
  getDateRange,
  getDistinctProductNames,
  createReport,
} = require("./../controllers/report");

const dataUrl =
  "https://raw.githubusercontent.com/younginnovations/internship-challenges/master/programming/petroleum-report/data.json";

const salesData = require("./sales.json");

describe("Petroleum Products Sales Report Test", () => {
  before(async () => {
    await db.sequelize.sync({
      force: true,
    });

    await insertDataToDatabase(salesData);
  });

  describe("fetch data from api", () => {
    it("it should fetch data and return an array", async () => {
      const response = await fetchDataFromApi(dataUrl);
      expect(response).to.be.an("array");
    });
  });

  describe("insert data to database", () => {
    it("it should insert data and return an array of inserted data", async () => {
      const response = await insertDataToDatabase(salesData);
      expect(response).to.be.an("array");
      expect(response).to.have.length(120);
    });
  });

  describe("get date ranges from database", () => {
    it("it should return an array with date ranges of 5 years interval", async () => {
      const dateRanges = await getDateRange();
      expect(dateRanges).to.be.an("array");
      expect(dateRanges).to.eql([
        { lower: 2010, upper: 2014 },
        { lower: 2005, upper: 2009 },
        { lower: 2000, upper: 2004 },
      ]);
    });
  });

  describe("get distinct product names from database", () => {
    it("it should return an array with product names", async () => {
      const productNames = await getDistinctProductNames();
      expect(productNames).to.be.an("array");
      expect(productNames).to.eql([
        "Petrol",
        "Diesel",
        "Kerosene",
        "Aviation Turbine Fuel",
        "Light Diesel Oil",
        "Furnace Oil",
        "LPG in MT",
        "Mineral Turpentine Oil",
      ]);
    });
  });

  describe("create sales report", () => {
    it("it should return array of sales stat", async () => {
      const report = await createReport();
      expect(report).to.be.an("array");
      expect(report).to.deep.include.members([
        {
          Product: "Petrol",
          Year: "2010 - 2014",
          Min: 187641,
          Max: 283567,
          Avg: 228816.8,
        },
      ]);
    });
  });
});
