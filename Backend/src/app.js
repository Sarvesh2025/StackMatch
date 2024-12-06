const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const userRouter =require("./routes/user")

const app = express();
app.use(express.json());
app.use(cookieParser());


const { authRouter } = require("./routes/auth")
 const { profileRouter } = require("./routes/profile");
 const { connectionRouter } = require("./routes/connection");

app.use("/", authRouter);
app.use("/profile/", profileRouter);
app.use("/connection", connectionRouter);
app.use("/user", userRouter);

connectDB().then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
    console.log("Server started at port:7777");
});
}).catch(err => {
    console.log("Database cannot be connected");
})













