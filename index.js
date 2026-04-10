const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
const Routes = require(path.resolve("src","routes","route"));
const ConectDB = require(path.resolve("src","database","connection"))

app.use(helmet());

Routes(app);

ConectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Connected Server on port ${PORT}`);
});