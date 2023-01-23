import { promises as fs } from "fs";
import express from "express";


const router = express.Router();
const { readFile } = fs;

//GET
//maisModelos
router.get("/maisModelos", async (req, res) => {
    try {
        let marcas = JSON.parse(
            await readFile("./data/car-list-2.json", "utf-8")
        );

        let marcaMaisModelo = [];
        let numModels = null;

        for (let i = 0; i < marcas.length; i++) {
            if (marcas[i].models.length >= numModels) {
                if (marcas[i].models.length === numModels) {
                    numModels = +marcas[i].models.length;
                    marcaMaisModelo.push(marcas[i].brand);
                } else {
                    numModels = +marcas[i].models.length;
                    marcaMaisModelo.push(marcas[i].brand);
                }
            }
        }

        console.log(marcas[0]);

        res.status(200);
        res.send(marcaMaisModelo);
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
        let numMax = req.params.num;
        let totalModels = [];

        let marcas = JSON.parse(
            await readFile("./data/car-list-2.json", "utf-8")
        );

        for (let i = 0; i < marcas.length; i++) {
            totalModels.push({"Marca": marcas[i].brand, "TotalModelo": marcas[i].models.length});
        }

        totalModels.sort(function (a, b) {
            return +(a.value > b.value) || +(a.value === b.value) - 1;
          });

          console.log(totalModels);

        res.status(200);
        res.send(req.params.num);
    } catch (err) {
        console.error(err);
    }
});

//listaMenosModelos/x
router.get("/listaMenosModelos:num", async (req, res) => {
    try {
        let numMax = req.params.num;
        
        let marcas = JSON.parse(
            await readFile("./data/car-list-2.json", "utf-8")
        );

        totalModels = [];

        for (let i = 0; i < marcas.length; i++) {
            totalModels.push({"Marca": marcas[i].brand, "TotalModelo": marcas[i].models.length});
        }

       console.log(totalModels);

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
