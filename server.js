// const express =require('express');
// const cors=require('cors');
// const mongoose = require('mongoose');

// require('dotenv').config();

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import loginRoute from "./routes/loginRoute.js";
import deliveryoRoute from "./routes/Deliveryo/deliveryoRouter.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.port || 8000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGODB_URI;
console.log(uri);

mongoose.connect(uri, {});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log(
    "------------------------Database Connected-----------------------"
  );
});

app.use("/", loginRoute);
app.use("/deliveryo", deliveryoRoute);

app.listen(port, () => {
  console.log(`Server is Running ${port}`);
});
