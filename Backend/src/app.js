const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());
//signup
app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User data saved successfully");
    }
    catch(err) {
        res.status(400).send("Error saving the user :" + err.message);
    }
});
// api for feed 
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(400).send("No user found");
        }
        else {
            res.send(users);
        }
    }
    catch {
        res.status(400).send("Something went wrong");
    }
});

// find user by emailID
app.get("/user", async (req, res) => {
    try {
        const email = req.body.emailId;
        console.log(email);
        const user = await User.find({ emailId: email });
        if (user.length === 0) {
            res.send("No user with email exist ");
        }
        else res.send(user);
    }
    catch {
        res.status(400).send("Something went wrong");
    }
});

// delete user by id 
app.delete("/delete/:userId", async (req, res) => {
    const userId = req.body.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        else { res.send(deletedUser); }
    }
    catch {
        res.status(400).send("Something wait wrong");
    }
});

// update

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({
            _id: userId
        }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Something went wrong "+err.message);
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













