import { promises as fs } from "fs";

const { readFile } = fs;

function getData() {
    try {
        return JSON.parse(readFile("./data/car-list.json", "utf-8"));
    } catch (err) {
        console.error(err);
    }
}

export { getData };