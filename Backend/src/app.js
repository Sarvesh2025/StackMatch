const express = require('express');
const  connectDB =require("./config/database");
const app = express();

connectDB().then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
    console.log("Server started at port:7777");
});
}).catch(err => {
    console.log("Database cannot be connected");
})









//u2bHnPREdFiPTGSm
//utsavsarveshpandey

//mongodb+srv://utsavsarveshpandey:<u2bHnPREdFiPTGSm>@cluster0.udnzy.mongodb.net/
//mongodb+srv://utsavsarveshpandey:<u2bHnPREdFiPTGSm>@cluster0.udnzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0