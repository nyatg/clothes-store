// Du ska utveckla ett RESTful WEB API för en klädesbutik.Butiken ska innehålla fem olika typer av varor: T - shirts,
//     Tröjor, Strumpor, Jackor och Byxor.För varje varutyp ska det finnas minst fem olika varor.API:et ska kunna
// hantera följande funktioner:
// 1. Varor:
// · Lägg till nya varor.
// · Uppdatera hela eller delar av en specifik vara.
// · Ta bort en specifik vara.

// 2. Användare:
// · Skapa en eller flera nya användare.
// · Uppdatera hela eller delar av en specifik användare.
// · Ta bort en specifik användare

import oExpress from "express";
import fs from "fs";
const Port = 3000;
const app = oExpress();

const dataJson = JSON.parse(fs.readFileSync("./clothes-store/inventory.json"));

app.use(oExpress.json());

app.get("/", (_req, _res) => {
    return _res.status(200).send("<h1>Welcome to our store</h1>");
})

app.get("/api/products", (_req, _res) => {
    return _res.status(200).json({
        status: "sucess",
        // count: dataJson.length,
        data: {
            dataJson: dataJson
        }
    });
})

app.post("/api/products", (_req, _res) => {
    let { body } = _req
    let addNewProduct = { id: dataJson[dataJson.length - 1].id + 1, ...body }
    
    dataJson.push(addNewProduct);
    _res.status(201).send(addNewProduct);
})

app.put("/api/products/:id", (_req, _res) => {
    // Vi uppdaterar body och använder params för att hitta det vi ska uppdatera :) 
    let { body, params: { id } } = _req
    
    // ser till så att id är endast ett nummer
    let productId = parseInt(id)
    if (isNaN(id)) {
        return _response.status(400).send('400: Invalid. Bad request');
    }

    // hittar rätt index i Json filen
    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId
    })

    // felmeddelande om index inte finns
    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    dataJson[productIndex] = { id: productId, ...body }
    
    _res.status(200).send(dataJson[productIndex]);

})

app.patch("/api/products/:id", (_req, _res) => {
    // Vi uppdaterar body och använder params för att hitta det vi ska uppdatera :) 
    let { body, params: { id } } = _req

    // ser till så att id är endast ett nummer
    let productId = parseInt(id)
    if (isNaN(id)) {
        return _response.status(400).send('400: Invalid. Bad request');
    }

    // hittar rätt index i Json filen
    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId
    })

    // felmeddelande om index inte finns
    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    dataJson[productIndex] = { ...dataJson[productIndex], ...body }

    _res.status(200).send(dataJson[productIndex]);

})

app.delete("/api/products/:id", (_req, _res) => {
    let { params: { id } } = _req
    
    let productId = parseInt(id)
    if (isNaN(id)) {
        return _res.status(400).send("400: invalid. Bad request")
    }

    // hittar rätt index i Json filen
    let productIndex = dataJson.findIndex((_product) => {
        return _product.id === productId
    })

    // felmeddelande om index inte finns
    if (productIndex == -1) {
        return _res.status(404).send("404: Page not found");
    }

    // tar bort från jsonobjektet, väljer vilken och hur många
    dataJson.splice(productIndex, 1)

    _res.sendStatus(204);
})


app.listen(Port, () => {
    console.log("App is running on port 3000")
})