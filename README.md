# clothes-store

för users
i postman 
för att hämta:
Get: http://localhost:3000/ 
Får ut följande: [
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
]

för att lägga till:
Post : http://localhost:3000/api/users
får ut följande: {
    "id": 3,
    "username": "mia",
    "email": "mia.brown@example.com",
    "password": "OsäkerdsdkcjksLösen:",
    "fullName": "mis Brown"
}

för att uppdatera:
Put: http://localhost:3000/api/users/:id
får ut följande: {
    "id": 3,
    "username": "Maria",
    "email": "mia.brown@example.com",
    "password": "OsäkerdsdkcjksLösen:",
    "fullName": "mis Brown"
}
Patch: http://localhost:3000/api/users/:id
får ut följande: {
    "id": 3,
    "username": "Roni",
    "email": "roni.brown@example.com",
    "password": "Osäkesfjkgsljf",
    "fullName": "Roni Brown"
}


För att ta bort: 
Delete: http://localhost:3000/api/users/:id
Får ut följande: 
inget 
