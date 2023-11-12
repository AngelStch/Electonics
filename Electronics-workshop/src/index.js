const express = require("express")
const handlebars = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose")
const routes = require("./router.js")
const { PORT, DB_URL } = require("./constants.js")
const cookieParser = require("cookie-parser");
const { auth } = require("./middlewares/authMiddleware.js");


const app = express()

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(auth)
 
app.engine("hbs", handlebars.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "src/views");

async function dbConnect() {
    await mongoose.connect(DB_URL);
}

dbConnect()
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => console.log(`Error while connecting in databse: ${err}`))

app.use(routes)

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))