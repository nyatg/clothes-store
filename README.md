# Clothes-Store

## Användning av API i Postman

## Hämta användare:

**GET**: http://localhost:3000/

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

## Lägg till användare:

**POST** : http://localhost:3000/api/users

## Får ut följande:

{
"id": 3,
"username": "mia",
"email": "mia.brown@example.com",
"password": "OsäkerdsdkcjksLösen:",
"fullName": "mis Brown"
}

## Uppdatera användare:

**PUT**: http://localhost:3000/api/users/:id

får ut följande: {
"id": 3,
"username": "Maria",
"email": "mia.brown@example.com",
"password": "OsäkerdsdkcjksLösen:",
"fullName": "mis Brown"
}

**PATCH**: http://localhost:3000/api/users/:id
får ut följande:
{
"id": 3,
"username": "Roni",
"email": "roni.brown@example.com",
"password": "Osäkesfjkgsljf",
"fullName": "Roni Brown"
}

## Ta bort användare

**DELETE**: http://localhost:3000/api/users/:id

Får ut följande: <br>
Inget
