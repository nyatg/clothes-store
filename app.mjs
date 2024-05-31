// 1. Varor:
// · Lägg till nya varor.
// · Uppdatera hela eller delar av en specifik vara.
// · Ta bort en specifik vara.

import express from "express";
import fs from "fs";
const PORT = 3000;
const app = express();

const dataJson = JSON.parse(fs.readFileSync("inventory.json"));

app.use(express.json());

//** GET
app.get("/", (_req, _res) => {
    return _res.status(200).send("<h1>Welcome to our store</h1>");
})

//** GET
//* http://localhost:3000/api/products
app.get("/api/products", (_req, _res) => {
    return _res.status(200).json({dataJson});
})

//** POST
app.post("/api/products", (_req, _res) => {
    let { body } = _req;
    let addNewProduct = { id: dataJson[dataJson.length - 1].id + 1, ...body };

    dataJson.push(addNewProduct);
    _res.status(201).send(addNewProduct);
})

//** PUT
app.put("/api/products/:id", (_req, _res) => {
    // Vi uppdaterar body och använder params för att hitta det vi ska uppdatera :) 
    let { body, params: { id } } = _req;
    
    let productId = parseInt(id);
    if (isNaN(id)) {
        return _response.status(400).send('400: Invalid. Bad request');
    }

    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId;
    })

    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    dataJson[productIndex] = { id: productId, ...body };
    
    _res.status(200).send(dataJson[productIndex]);

})

//** PATCH
app.patch("/api/products/:id", (_req, _res) => {
    // Vi uppdaterar body och använder params för att hitta det vi ska uppdatera :) 
    let { body, params: { id } } = _req;

    // ser till så att id är endast ett nummer
    let productId = parseInt(id);
    if (isNaN(id)) {
        return _response.status(400).send('400: Invalid. Bad request');
    }

    // hittar rätt index i Json filen
    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId;
    })

    // felmeddelande om index inte finns
    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    dataJson[productIndex] = { ...dataJson[productIndex], ...body };

    _res.status(200).send(dataJson[productIndex]);

})

//** DELETE
app.delete("/api/products/:id", (_req, _res) => {
    let { params: { id } } = _req;
    
    let productId = parseInt(id);
    if (isNaN(id)) {
        return _res.status(400).send("400: invalid. Bad request");
    }

    // hittar rätt index i Json filen
    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId;
    })

    // felmeddelande om index inte finns
    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    // tar bort från jsonobjektet, väljer vilken och hur många
    dataJson.splice(productIndex, 1);

    _res.sendStatus(204);
})


app.listen(PORT, () => {
    console.log(`App is running on localhost: ${PORT} http://localhost:3000`);
})