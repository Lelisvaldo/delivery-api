import { promises as fs } from "fs";
import express from "express";
import { log } from "console";

const router = express.Router();
const { readFile } = fs;

//GET
//maisModelos
router.get("/maisModelos", async (req, res) => {
    try {
        let marcas = JSON.parse(
            await readFile("./data/car-list.json", "utf-8")
        );

        let marcaMaisModelo;
        let numModels = null;

        for (let i = 0; i < marcas.length; i++) {
            if (marcas[i].models.length >= numModels) {
                if (marcas[i].models.length === numModels) {
                    numModels = +marcas[i].models.length;
                    marcaMaisModelo += `,${marcas[i].brand}`;
                } else {
                    numModels = +marcas[i].models.length;
                    marcaMaisModelo = `${marcas[i].brand}`;
                }
            }
        }

        res.status(200);
        res.send(marcaMaisModelo.split(","));
    } catch (err) {
        console.error(err);
    }
});

//menosModelos
router.get("/menosModelos", async (req, res) => {
    try {
        let marcas = JSON.parse(
            await readFile("./data/car-list.json", "utf-8")
        );

        let marcaMenosModelo;
        let numModels = 9999999;

        for (let i = 0; i < marcas.length; i++) {
            if (marcas[i].models.length <= numModels) {
                if (marcas[i].models.length === numModels) {
                    numModels = +marcas[i].models.length;
                    marcaMenosModelo += `,${marcas[i].brand}`;
                } else {
                    numModels = +marcas[i].models.length;
                    marcaMenosModelo = `${marcas[i].brand}`;
                }
            }
        }

        res.status(200);
        res.send(marcaMenosModelo.split(","));
    } catch (err) {
        console.error(err);
    }
});

//listaMaisModelos/x
router.get("/listaMaisModelos/:num", async (req, res) => {
    try {
        req.params.num;

        res.status(200);
        res.send(req.params.num);
    } catch (err) {
        console.error(err);
    }
});

//listaMenosModelos/x
router.get("/listaMenosModelos:num", async (req, res) => {
    try {
        req.params.num;

        res.status(200);
        res.send(req.params.num);
    } catch (err) {
        console.error(err);
    }
});

//POST
//listaModelos
router.post("/listaModelos", async (req, res) => {
    try {
        let nomeMarca = req.body.nomeMarca;
        let data = JSON.parse(await readFile("./data/car-list.json", "utf-8"));

        let filterData = data.find((marca) => {
            return nomeMarca.toLowerCase() === marca.brand.toLowerCase();
        });

        res.status(200);
        res.send(
            filterData == undefined || filterData == null
                ? []
                : filterData.models
        );
    } catch (err) {
        console.error(err);
    }
});

export default router;
