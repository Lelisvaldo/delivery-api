import { promises as fs } from "fs";
import express from "express";
import { log } from "console";

const router = express.Router();
const { readFile } = fs;

//GET
//maisModelos
router.get("/maisModelos", async (req, res) => {
    try {
        // Mercedes-Benz, Possui 58 modelos
        let marcas = JSON.parse(
            await readFile("./data/car-list-2.json", "utf-8")
        );

        let marcaMaioModelo = [];
        let numModels = 0;

        for (let i = 0; i < marcas.length; i++) {
            //console.log(`A marca e : ${marcas[i].brand}, Possui ${marcas[i].models.length} modelos`);
            if (marcas[i].models.length >= numModels) {
                if (marcas[i].models.length === numModels) {
                    marcaMaioModelo += `,${marcas[i].brand}`;
                    numModels = +marcas[i].models.length;
                } else {
                    numModels = +marcas[i].models.length;
                    marcaMaioModelo = `${marcas[i].brand}`;
                }
            }
        }

        res.status(200);
        res.send([marcaMaioModelo]);
    } catch (err) {
        console.error(err);
    }
});

//menosModelos
router.get("/menosModelos", async () => {
    try {
    } catch (err) {
        console.error(err);
    }
});

//listaMaisModelos/x
router.get("/listaMaisModelos/:num", async () => {
    try {
        req.params.num;
    } catch (err) {
        console.error(err);
    }
});

//listaMenosModelos/x
router.get("/listaMenosModelos:num", async () => {
    try {
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
            filterData === undefined || filterData === null
                ? []
                : filterData.models
        );
    } catch (err) {
        console.error(err);
    }
});

export default router;
