import { promises as fs } from "fs";
import express from "express";
import { parse } from "path";

const router = express.Router();
const { readFile, writeFile } = fs;
const dataFile = JSON.parse(await readFile("./data/pedidos.json", "utf-8"));

//GET
//getOrder
router.get("/getOrder/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let order = dataFile.pedidos.find((order) => order.id === id);

        res.status(200);
        res.send(order);
    } catch (error) {
        res.status(400).send({ error: err.message });
    }
});

//DELETE
//delete
router.delete("/delete/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);

        dataFile.pedidos = dataFile.pedidos.filter((order) => order.id !== id);

        await writeFile(
            "./data/pedidos.json",
            JSON.stringify(dataFile, null, 5)
        );

        res.end();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

//POST
//create
router.post("/create", async (req, res) => {
    try {
        if (isEmpty(req.body)) {
            res.status(404);
            res.send("Informe os parâmetros necessários.");
        }

        let order = {};
        order.cliente = req.body.cliente;
        order.produto = req.body.produto;
        order.entregue = false;
        order.valor = req.body.valor;
        order.timestamp = new Date();

        order = { id: dataFile.nextId++, ...order };

        dataFile.pedidos.push(order);

        await writeFile(
            "./data/pedidos.json",
            JSON.stringify(dataFile, null, 5)
        );

        res.status(200);
        res.send(order);
    } catch (err) {
        res.status(400).send({ error: err.message });
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
            filterData == undefined || filterData == null ? [] : filterData
        );
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

function isEmpty(object) {
    return Object.keys(object).length === 0;
}

export default router;
