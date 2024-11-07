const express = require("express");
const cors = require("cors");
const userRoute = require("./Routes/userRoute.js");
const chatRoute = require("./Routes/chatRoute.js");
const messageRoute = require("./Routes/messageRoute.js");

const mongoose = require("mongoose");

const app = express();
require("dotenv").config();
// Use CORS middleware


app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Hi, I am Kapil");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDB connection failed: ", error.message));

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
