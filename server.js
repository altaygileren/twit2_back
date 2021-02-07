require("dotenv").config();
const express = require("express");
const app = express();
const users = require("./routes/api/users");
const twits = require("./routes/api/twits");
const comments = require("./routes/api/comments");
const cors = require("cors");
const dbConnection = require("./config");
app.use(cors());
app.use(express.json());

dbConnection();

app.use("/api/users", users);
app.use("/api/twits", twits);
app.use("/api/comments", comments);

const port = process.env.PORT || 1337;
app.listen(port, () => console.log("Server running"));
