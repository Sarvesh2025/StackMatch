const express = require('express');
const app = express();



app.use("/", (req, res) => {
    res.send("Hello this is homePage");
});
app.use("/test", (req, res) => {
    res.send("Hello this is testing page");
});

app.use("/user", (req, res) => {
    res.send("Hello this is users dashboard");
});


app.listen(7777, () => {
    console.log("Server started at port:7777");
});
