const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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
        res.status(400).send("Something went wrong");
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isValid = await user.validatePassword(password);
        if (isValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
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

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("LogOut successfully");
});

module.exports = { authRouter };
