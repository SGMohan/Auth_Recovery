const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();
connectDB();//connection to the database
const AuthRouter = require('./controller/auth.controller');


const app = express();
const port = process.env.PORT || 3000 

app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/auth", AuthRouter);

// Start the server
app.listen(port, process.env.HOSTNAME, () => {
  console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
});

app.get("/", (_, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
  });
});

