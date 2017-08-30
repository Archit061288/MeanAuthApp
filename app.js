const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config/database");
 
// DB connected
mongoose.connect(config.database);

// On Connected
mongoose.connection.on("connected",()=>{
	console.log("Connected to database "+config.database);
})

// On Error
mongoose.connection.on("error",(err)=>{
	console.log("Database Error "+err);
})

const app = express();
const port  = 3000;

var users = require('./routes/users');

// Cors Middleware
app.use(cors());

// Passport
app.use(passport.initialize());
app.use(passport.session());

//require('./config/passport')(passport);

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set Static 
app.use(express.static(path.join(__dirname,'public')));

app.use("/users",users);

// Index Route
app.get("/",(req,res)=>{
	res.send("Invalid data");
})

// Start Server
app.listen(port,()=>{
	console.log("Server listen at port "+port);
})