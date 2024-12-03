const express = require('express');
const connectDB = require("./config/database");
const bcrypt=require('bcrypt')
const User = require("./models/user");
const app = express();
app.use(express.json());
//signup
app.post('/signup', async (req, res) => {
    const { firstName, lastName, emailId, githubId, password, skills, about, photoUrl } = req.body;
    if (!firstName || !emailId || !password) {
        return res.status(400).send("Missing required fields");
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const user = new User({
            firstName,
            lastName,
            emailId,
            githubId,
            password: hashedPassword,
            skills,
            about,
            photoUrl
        });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

// login 
app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            res.send("Login Successfully");
        }
        else {
            throw new Error("Invalid credentials");
        }
    }
    catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
}
);

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

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {

        const ALLOWED_UPDATES = ["photourl", "about", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills cant be more than 10");
        }
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













