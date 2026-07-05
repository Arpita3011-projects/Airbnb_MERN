const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.ATLASDB_URL);

mongoose.connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });