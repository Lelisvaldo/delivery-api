import express from "express";
import order from "./routes/order.js";

const app = express();
const port = 3000;


app.use(express.json());

app.use("/order", order);

app.listen(port, async () => {
    try {
        console.log(`API Started!, Running in port -> ${port}`);
    } catch (err) {
        console.log(err);
    }
});
