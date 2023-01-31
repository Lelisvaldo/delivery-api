import { promises as fs } from "fs";
import express from "express";

const router = express.Router();
const { readFile } = fs;
const dataFile =  JSON.parse(await readFile("./data/car-list.json", "utf-8"));

//GET
//maisModelos
router.get("/maisModelos", async (req, res) => {
    try {
        let marcaMaisModelo;
        let numModels = null;

        for (let i = 0; i < dataFile.length; i++) {
            if (dataFile[i].models.length >= numModels) {
                if (dataFile[i].models.length === numModels) {
                    numModels = +dataFile[i].models.length;
                    marcaMaisModelo += `,${dataFile[i].brand}`;
                } else {
                    numModels = +dataFile[i].models.length;
                    marcaMaisModelo = dataFile[i].brand;
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
        let marcaMenosModelo;
        let numModels = 9999999;

        for (let i = 0; i < dataFile.length; i++) {
            if (dataFile[i].models.length <= numModels) {
                if (dataFile[i].models.length === numModels) {
                    numModels = +dataFile[i].models.length;
                    marcaMenosModelo += `,${dataFile[i].brand}`;
                } else {
                    numModels = +dataFile[i].models.length;
                    marcaMenosModelo = `${dataFile[i].brand}`;
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
        let result = [];

        for (let i = 0; i < dataFile.length; i++)
            totalModels.push({"Brand": dataFile[i].brand, "Quantity": dataFile[i].models.length});

        totalModels.sort((a, b) => (b.Quantity - a.Quantity)).sort(
            (a, b) => (a.Brand > b.Brand ? 1 : -1)
        );

        totalModels.sort(function(a, b) {
            var nameA = a.Brand.toUpperCase();
            var nameB = b.Brand.toUpperCase();
            
            if (nameA < nameB) 
                return -1;
            if (nameA > nameB)
                return 1;
            
            return 0;
        });
        
        totalModels.sort(function(a, b) {
            return b.Quantity - a.Quantity;
        });

        for (let i = 0; i < numMax; i++)
            result.push(`${totalModels[i].Brand} - ${totalModels[i].Quantity}`);

        res.status(200);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
});

//listaMenosModelos/x
router.get("/listaMenosModelos/:num", async (req, res) => {
    try {
        let numMax = req.params.num;

        let totalModels = [];
        let result = [];

        for (let i = 0; i < dataFile.length; i++)
            totalModels.push({"Brand": dataFile[i].brand, "Quantity": dataFile[i].models.length});

        totalModels.sort((a, b) => (b.Quantity - a.Quantity))
        .sort((a, b) => (a.Brand < b.Brand ? 1 : -1));

        totalModels.sort(function(a, b) {
            return b.Quantity - a.Quantity;
        }).reverse();

        for (let i = 0; i < numMax; i++)
            result.push(`${totalModels[i].Brand} - ${totalModels[i].Quantity}`);

        res.status(200);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
});

//POST
//listaModelos
router.post("/listaModelos", async (req, res) => {
    try {
        let nomeMarca = req.body.nomeMarca;

        let filterData = dataFile.find((marca) => {
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
