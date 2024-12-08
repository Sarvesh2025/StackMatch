const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({message:"Data fetched successfully",data:user});
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
      }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
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
