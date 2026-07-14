const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.ATLASDB_URL)
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
