import { promises as fs } from "fs";
import express from "express";

const router = express.Router();
const { readFile, writeFile } = fs;
const dataFile = JSON.parse(await readFile("./data/pedidos.json", "utf-8"));
const products = [];

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

//sunOrders/client
router.get("/sunOrders/client/:name", async (req, res) => {
    try {
        let clientName = req.params.name.toLowerCase();
        let total = 0;

        dataFile.pedidos
            .filter(
                (pedido) =>
                    String(pedido.cliente).toLowerCase() == clientName &&
                    pedido.entregue
            )
            .map((pedido) => (total += pedido.valor));

        res.status(200);
        res.json({ Total: total });
    } catch (error) {
        res.status(400).send({ error: err.message });
    }
});

//sunOrders/product
router.get("/sunOrders/product/:name", async (req, res) => {
    try {
        let productName = req.params.name.toLowerCase();
        let total = 0;

        dataFile.pedidos
            .filter(
                (pedido) =>
                    String(pedido.produto).toLowerCase() == productName &&
                    pedido.entregue
            )
            .map((pedido) => (total += pedido.valor));

        res.status(200);
        res.json({ Total: total });
    } catch (error) {
        res.status(400).send({ error: err.message });
    }
});

//product/mostSelleds
router.get("/product/mostSelleds", async (req, res) => {
    try {
        const totalpedidos = [];
        let pedidos = dataFile.pedidos;

        pedidos.forEach((pedido) => {
            let pedidoLocal = totalpedidos.find(
                (p) => p.produto == pedido.produto
            );
            if (pedidoLocal != undefined) {
                totalpedidos[totalpedidos.indexOf(pedidoLocal)].quantidade += 1;
            } else {
                totalpedidos.push({ produto: pedido.produto, quantidade: 1 });
            }
        });

        res.status(200);
        res.send(totalpedidos);
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

//PUT
//update Order
router.put("/update/order", async (req, res) => {
    try {
        if (isEmpty(req.body)) {
            res.status(404);
            res.send("Informe os parâmetros necessários.");
        }

        if (!isBoolean(req.body.entregue)) {
            res.status(404);
            res.send(
                "O parâmetro 'entregue' nao pode ser diferente de 'true' ou 'false'."
            );
        }

        getProducts();

        let order = {};
        order.id = parseInt(req.body.id);
        order.cliente = req.body.cliente;
        order.produto = req.body.produto;
        order.entregue = req.body.entregue;
        order.valor = req.body.valor;
        order.timestamp = new Date();

        let orderIndex = dataFile.pedidos.findIndex((o) => o.id === order.id);

        let productExist =
            products.filter((product) => order.produto == product) != false;

        if (!productExist) {
            res.status(404);
            res.send("O Produto Informado não é um produto válido.");
        }

        dataFile.pedidos[orderIndex] = order;

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

//update staus
router.put("/update/status", async (req, res) => {
    try {
        let id = parseInt(req.body.id);

        if (isEmpty(req.body)) {
            res.status(404);
            res.send("Informe os parâmetros necessários.");
        }

        if (!isBoolean(req.body.entregue)) {
            res.status(404);
            res.send(
                "O parâmetro 'entregue' nao pode ser diferente de 'true' ou 'false'."
            );
        }

        let orderIndex = dataFile.pedidos.findIndex((o) => o.id === id);

        let order = {};
        order.id = dataFile.pedidos[orderIndex].id;
        order.cliente = dataFile.pedidos[orderIndex].cliente;
        order.produto = dataFile.pedidos[orderIndex].produto;
        order.entregue = req.body.entregue;
        order.valor = dataFile.pedidos[orderIndex].valor;
        order.timestamp = new Date();

        dataFile.pedidos[orderIndex] = order;

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

const isEmpty = (object) => {
    return Object.keys(object).length === 0;
};

const isBoolean = (variable) => {
    return typeof variable == "boolean";
};

const getProducts = () => {
    dataFile.pedidos.every((pedido) => products.push(pedido.product));
};

const getTotalProduct = (productName) => {
    let total = 0;
    return dataFile.pedidos
        .filter(
            (pedido) =>
                String(pedido.produto).toLowerCase() ==
                productName.toLowerCase()
        )
        .map((pedido) => (total += pedido.valor));
};

export default router;
