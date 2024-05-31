import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Hämta den aktuella filens sökväg och katalog
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statiska filer (om du har några)
app.use(express.static('views'));

// Ställ in EJS som vy-motor
app.set('view engine', 'ejs');
app.set('views', './views');

// Hämta JSON-filen synkront
const dataPath = path.join(__dirname, "inventory.json");
let jsonData = [];

try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    jsonData = JSON.parse(rawData);
} catch (err) {
    console.error("Error reading JSON file:", err);
}

app.use(express.json());

// En route för att rendera index.ejs
app.get('/', (req, res) => {
    res.render('index', { data: { displayItems: jsonData } });
});

//** GET
//* http://localhost:3000/api/products
app.get("/api/products", (_req, _res) => {
    return _res.status(200).json(jsonData);
});

//** POST
app.post('/api/products', (req, res) => {
    let { body } = req;
    let newProduct = { id: jsonData.length ? jsonData[jsonData.length - 1].id + 1 : 1, ...body };

    jsonData.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(201).send(newProduct);
});

//** PUT
app.put('/api/products/:id', (req, res) => {
    let { body, params: { id } } = req;
    let productId = parseInt(id);

    if (isNaN(productId)) {
        return res.status(400).send('400: Invalid. Bad request');
    }

    let productIndex = jsonData.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).send("404: Page not found");
    }

    jsonData[productIndex] = { id: productId, ...body };
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(200).send(jsonData[productIndex]);
});

//** PATCH
app.patch('/api/products/:id', (req, res) => {
    let { body, params: { id } } = req;
    let productId = parseInt(id);

    if (isNaN(productId)) {
        return res.status(400).send('400: Invalid. Bad request');
    }

    let productIndex = jsonData.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).send("404: Page not found");
    }

    jsonData[productIndex] = { ...jsonData[productIndex], ...body };
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(200).send(jsonData[productIndex]);
});

//** DELETE
app.delete('/api/products/:id', (req, res) => {
    let { id } = req.params;
    let productId = parseInt(id);

    if (isNaN(productId)) {
        return res.status(400).send("400: invalid. Bad request");
    }

    let productIndex = jsonData.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).send("404: Page not found");
    }

    jsonData.splice(productIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
