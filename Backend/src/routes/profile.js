const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
      }
   
});

profileRouter.patch("/editProfile", userAuth, async (req, res) => {
try{if (!validateEditProfileData(req)) {
    throw new Error("Invalid Edit Request");
}
const loggedInUser = req.user;
Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
await loggedInUser.save();
res.json({
    message: `${loggedInUser.firstName}, your Profile updated successfully!!`,
    data: loggedInUser,
});
    }
catch (err) {
    res.status(400).send("ERROR : " + err.message);
    }

});

module.exports = {profileRouter};