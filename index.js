//const http = require('http');
const express = require("express");
//const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const otpRoute = require("./routes/otp")

//const server = http.createServer(app);

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connection Successfull!"))
    .catch((err) => console.log(err));

//const rawBodySaver = (req, res, buf, encoding) => {
//    if (buf && buf.length) {
//        req.rawBody = buf.toString(encoding || 'utf8');
//    }
//};

//const options = {
//    verify: rawBodySaver,
//};

//app.use(bodyParser.json(options));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/user", otpRoute);

app.listen(5000, () => {
    console.log("Backend server is running!")
});