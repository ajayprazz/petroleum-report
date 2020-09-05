const dataUrl =
  "https://raw.githubusercontent.com/younginnovations/internship-challenges/master/programming/petroleum-report/data.json";

const {
  fetchDataFromApi,
  insertDataToDatabase,
  createReport,
  errorHandler,
} = require("./controllers/report");

(async url => {
  try {
    const jsonData = await fetchDataFromApi(url);

    if (jsonData.length) {
      await insertDataToDatabase(jsonData);

      const report = await createReport();
      console.log(
        "Sales report of petroleum products for five years intervals:"
      );
      console.table(report);
    }
  } catch (error) {
    errorHandler(error);
  }
})(dataUrl);
