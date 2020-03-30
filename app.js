require("dotenv").config();

const express = require("express");
const cors = require("cors");


const controllers = require("./src/api/controllers");

const app = express();

app.use(cors());
app.use(express.static('./src/site'))

controllers.bindControllers(app);

// Run Script
console.log(`Listening on ${process.env.PORT}`);
app.listen(process.env.PORT);
