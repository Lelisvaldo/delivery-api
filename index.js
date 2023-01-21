import express from "express";
import marcas from "./routes/marcas.js";

const app = express();

app.use(express.json());

app.use("/marcas", marcas);

app.listen(3000, async () => {
    try {
        console.log("API Started!");
    } catch (err) {
        console.log(err);
    }
});