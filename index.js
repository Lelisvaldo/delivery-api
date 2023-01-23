import express from "express";
import marcas from "./routes/marcas.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/marcas", marcas);

app.listen(port, async () => {
    try {
        console.log(`API Started!, Running in port -> ${port}`);
    } catch (err) {
        console.log(err);
    }
});
