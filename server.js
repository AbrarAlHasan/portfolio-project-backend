// const express =require('express');
// const cors=require('cors');
// const mongoose = require('mongoose');

// require('dotenv').config();

import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import router from './routes/route.js'

dotenv.config();

const app=express();
const port=process.env.port || 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
console.log(uri)
mongoose.connect(uri,{});


const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("------------------------Database Connected-----------------------");
});



app.use('/',router)

app.listen(port,()=>{
    console.log(`Server is Running ${port}` )
})