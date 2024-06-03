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
app.use(express.static(__dirname + '/public'));

// Ställ in EJS som vy-motor
app.set('view engine', 'ejs');
app.set('views', './views');

// Hämta JSON-filen synkront
const dataPath = path.join(__dirname, "inventory.json");
let jsonData = {};

try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    jsonData = JSON.parse(rawData);
    
    // Kontrollera att jsonData är ett objekt
    if (typeof jsonData !== 'object') {
        throw new Error("Data in JSON file is not an object");
    }
} catch (err) {
    console.error("Error reading JSON file:", err);
}

app.use(express.json());

// En route för att rendera index.ejs
//* Link: http://localhost:3000/
app.get('/', (req, res) => {
    const displayItems = Object.values(jsonData).flat(); // Samlar ihop alla produkter från alla kategorier
    res.render('index', { displayItems: displayItems });
});

//** GET-JSON
//* http://localhost:3000/api/products
app.get("/api/products", (request, response) => {
    return response.status(200).json(jsonData);
});

//** Link: http://localhost:3000/detail/25
app.get('/detail/:id', (request, response) => {
    let { id } = request.params;
    id = parseInt(id); 

    let product;
    for (let category in jsonData) {
        product = jsonData[category].find(product => product.id === id);
        if (product) break; // Om produkten hittas, avbryt loopen
    }

    if (!product) {
        return response.status(400).send("400: invalid. Bad request");
    }

    response.render('detail', {
        pageTitle: 'Product Detail',
        product: product
    });
});

//** POST
app.post('/api/products', (req, res) => {
    let { body } = req;
    let keys = Object.keys(body)  
    let newProduct = { id: Object.keys(jsonData).length ? Object.values(jsonData).flat().length + 1 : 1, ...body[keys[0]][0] };
    for (let category in body) {
        if (!jsonData[category]) {
            jsonData[category] = [];
        }
        jsonData[category].push(newProduct);
    }
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(201).send(newProduct);
});

//** PUT
app.put('/api/products/:id', (req, res) => {
    let { body, params: { id } } = req;
    let productId = parseInt(id);
    let productFound = false;
    let keys = Object.keys(body)

    if (isNaN(productId)) {
        return res.status(400).send('400: Invalid. Bad request');
    }

    for (let category in jsonData) {
        let productIndex = jsonData[category].findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            jsonData[category][productIndex] = { id: productId, ...body[keys[0]][0] };
            productFound = true;
            break;
        }
    }
    if (!productFound) {
        return res.status(404).send("404: Page not found");
    }
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(200).send(jsonData);
});

//** PATCH
app.patch('/api/products/:id', (req, res) => {
    let { body, params: { id } } = req;
    let productId = parseInt(id);
    let productFound = false;
    let keys = Object.keys(body)
    if (isNaN(productId)) {
        return res.status(400).send('400: Invalid. Bad request');
    }
    for (let category in jsonData) {
        let productIndex = jsonData[category].findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            jsonData[category][productIndex] = { ...jsonData[category][productIndex], ...body[keys[0]][0] };
            productFound = true;
            break;
        }
    }
    if (!productFound) {
        return res.status(404).send("404: Page not found");
    }
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(200).send(jsonData);
});

//** DELETE
app.delete('/api/products/:id', (req, res) => {
    let { id } = req.params;
    let productId = parseInt(id);
    let productFound = false;
    if (isNaN(productId)) {
        return res.status(400).send("400: invalid. Bad request");
    }
    for (let category in jsonData) {
        let productIndex = jsonData[category].findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            jsonData[category].splice(productIndex, 1);
            productFound = true;
            break;
        }
    }
    if (!productFound) {
        return res.status(404).send("404: Page not found");
    }
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.sendStatus(204);
});

//* Link: http://localhost:3000/category/Byxor
app.get('/category/:type', (request, response) => {
    let { params: { type } } = request;
    if (!jsonData[type]) return response.status(400).send("400: invalid. Bad request");
    response.render('cat.ejs', {products: jsonData[type]});
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
