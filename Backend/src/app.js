const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();


app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Sarvesh",
        age: 20,
        gender: "Male",
        githubId: "Sarvesh2025"
    });
    try {
        await user.save();
        res.send("User data saved successfully");
    }
    catch(err) {
        res.status(400).send("Error saving the user :" + err.message);
    }
});
connectDB().then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
    console.log("Server started at port:7777");
});
}).catch(err => {
    console.log("Database cannot be connected");
})













