const port = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");

app.use(cors({}));
const Routes = require("./routes");
app.use(express.json());
app.use("/api/", Routes);

models.sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(port, () => console.log(`database listening to port ${port}`));
  })
  .catch((err) => console.log(err));
