const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT);
console.log(process.env.PORT);

const userRouter = require("./routes/users");
const bookRouter = require("./routes/book");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
