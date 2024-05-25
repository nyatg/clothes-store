// 2. Användare:
// · Skapa en eller flera nya användare.
// · Uppdatera hela eller delar av en specifik användare.
// · Ta bort en specifik användare

import oExpress from "express";
const PORT = 3000;
const app = oExpress();

app.use(oExpress.json());

let users = [
    {
        "id": 1,
        "username": "johndoe",
        "email": "john.doe@example.com",
        "password": "säkertLösenord123",
        "fullName": "John Doe"
    },
    {
        "id": 2,
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "password": "säkertLösenord456",
        "fullName": "Jane Doe"
    }
];


//** GET
app.get("/", (_req, _res) => {
    return _res.status(200).send(users);
})

//** POST
app.post("/api/users", (_req, _res) => {
    let { body } = _req
    let addNewUser = { id: users[users.length - 1].id + 1, ...body }

    users.push(addNewUser);
    _res.status(201).send(addNewUser);
});

//** PUT
app.put("/api/users/:id", (_req, _res) => {
    let { body, params: { id } } = _req
    
    let userId = parseInt(id)
    if (isNaN(id)) {
        return _res.status(400).send('400: Invalid. Bad request') //400: Invalid. Bad request
    }
    let userIndex = users.findIndex((_user) => {
        return _user.id === userId
    })

    if (userIndex == -1) {
        return _res.status(404).send('404: Page not found') //404: Page not found
    }

    users[userIndex] = { id: userId, ...body }

    _res.status(200).send(users[userIndex])

})

//** PATCH
app.patch("/api/users/:id", (_req, _res) => {
    let { body, params: { id } } = _req

    let userId = parseInt(id)
    if (isNaN(id)) {
        return _res.status(400).send('400: Invalid. Bad request') //400: Invalid. Bad request
    }
    let userIndex = users.findIndex((_user) => {
        return _user.id === userId
    })

    if (userIndex == -1) {
        return _res.status(404).send('404: Page not found') //404: Page not found
    }

    users[userIndex] = { ...users[userIndex], ...body }

    _res.status(200).send(users[userIndex])
});

//** DELETE
app.delete("/api/users/:id", (_req, _res) => {
    let { params: { id } } = _req
    
    let userId = parseInt(id)
    if (isNaN(id)) {
        return _res.status(400).send("400: invalid. Bad request...")
    }

    let userIndex = users.findIndex((_user) => {
        return _user.id === userId
    })
    if (userIndex == -1) {
        return _res.status(404).send("404: page not found...")
    }

    users.splice(userIndex, 1)
    _res.sendStatus(204)
})

app.listen(PORT, () => {
    console.log(`App is running on localhost: ${PORT}`)
})