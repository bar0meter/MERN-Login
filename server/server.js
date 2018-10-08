const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const users = require("./routes/api/signin.js");
const cors = require("cors");

// Configuration
// ================================================================================================

// Set up Mongoose
mongoose
  .connect("mongodb://localhost:27017/login_demo")
  .then(() => console.log("Database connected"))
  .catch(err =>
    console.error("Error occured while connecting to database : ", err)
  );
mongoose.Promise = global.Promise;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routing
app.use("/api/users", users);

app.listen(port, "0.0.0.0", err => {
  if (err) {
    console.log(err);
  }

  console.info(">>> 🌎 Open http://localhost:%s/ in your browser.", port);
});
