import { promises as fs } from "fs";
import express from "express";

const router = express.Router();
const { readFile } = fs;
const dataFile =  JSON.parse(await readFile("./data/pedidos.json", "utf-8"));


//POST
//create
router.post("/create", async (req, res) => {
    try {
        let id = dataFile.nextId;
        
        
        res.status(200);
        res.send();
    } catch (err) {
        console.error(err);
    }
});

//update
router.post("/update", async (req, res) => {
    try {
        let id = req.body.id;
        
        let filterData = dataFile.pedidos.find((order) => {
            return id === order.id;
        });

        res.status(200);
        res.send(
            filterData == undefined || filterData == null
                ? []
                : filterData
        );
    } catch (err) {
        console.error(err);
    }
});

export default router;