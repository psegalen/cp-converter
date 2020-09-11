const fs = require("fs");

// Sub-base file: allows us to test our code instantly
const data = require("./subbase.json");
// Base file: switch on this to activate the converter on all the data
//const data = require("./base.json");
// Result file name: modify it if you want another naming
const resultFileName = "./cp.json";
// "Départements" considered (those are for "Nouvelle-Aquitaine"),
// cities of other regions will be filtered
const departements = [
  "16",
  "17",
  "19",
  "23",
  "24",
  "33",
  "40",
  "47",
  "64",
  "79",
  "86",
  "87",
];
let result = [];

const convertName = (input) =>
  input
    .normalize("NFD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ");

const convert = async () => {
  for (let i in data) {
    // Get a city
    const input = { cp: data[i].codePostal, c: data[i].nomCommune };
    // Add a field allowing efficient filtering (no accent, no dash)
    input.s = `${input.cp} ${convertName(input.c)}`;
    // If it is in the correct region
    if (
      departements.findIndex((d) => input.cp.startsWith(d)) !== -1
    ) {
      result.push(input);
    }
  }

  // Write the result file
  await fs.writeFile(
    resultFileName,
    JSON.stringify(result),
    function (err) {
      if (err) return console.log(err);
    }
  );
};

convert();

console.log("Finished!", result.length);
