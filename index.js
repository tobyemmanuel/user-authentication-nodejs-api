require('dotenv').config()
const {PORT, MONGO_URI} = process.env
const express = require("express")
const {
    json
  } = require("express");

const routes = require("./routes/UsersRoute");


const app = express();
app.use(express.json({extended: false})) // for parsing application/json
app.use(express.urlencoded({
  extended: true
})) // for parsing application/x-www-form-urlencoded


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect to the database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to the database"); // log connection success message
}).catch(err => {
  console.log('Could not connect to the database. Exiting now!', err); //log connection error message if it exists
  process.exit(); //close
});

app.use(json());
//app.get("/", (req, res) => res.json({message: "Welcome to the app."}));
app.use("/", routes); // initiate routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); //print port and connection success
});