const express = require('express')
const Users = require('./MOCK_DATA.json')
const fs = require('fs')

const app = express()
const PORT = 8000

// Middleware - Plugin
app.use(express.urlencoded({extended:false}))

// Middleware use
app.use((req , res , next) => {
    fs.appendFile('log.txt' , `\n ${Date.now()} ${req.ip} ${req.method} ${req.path}` , (err , data) => {
        next()
    })
})
app.use((req , res , next) => {
    console.log("hello from middleware 1");
    next()
})

app.use((req , res , next) => {
    console.log("hello from middleware 2");
    res.end("hey")
})

// Routes......

// GET /users -> List all users (HTML document render)
app.get('/users' , (req , res) => {
    const html = `
    <ul>
        ${Users.map((user) => 
            `<h5>First Name: <li>${user.first_name}</li> </h5>`
        ).join("")}
    </ul>
    `;
    return res.send(html);
})

// GET /api/users -> List all users JSON
app.get('/api/users' , (req , res) => {
    return res.json(Users);
})

// GET /api/users/1 -> Get the user with ID 1
app.get('/api/users/:id' , (req , res) => {
    const id = Number(req.params.id); // first i find the id i convert it into number because it is given in the string format
    const user = Users.find((user) => user.id === id)
    return res.send(user)
})

// POST /api/users -> Create new user
app.post('/api/users' , (req , res) => {
    const body = req.body;
    Users.push({body , id:Users.length+1})

    // to add the data in our file MOCK_DATA.json
    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(Users) , (err , data) => {
        return res.send({status:"success" , id:Users.length})
    })
})

// PATCH /api/users/1 -> Edit the user with ID 1
app.patch('/api/users/:id' , (req , res) => {
    const body = req.body;
    console.log(body)
    return res.json({status:"pending"})
})

// DELETE /api/users/1 -> Delete the user with ID 1
app.delete('/api/users/:id' , (req , res) => {
    const body = req.body;
    console.log(body)
    return res.json({status:"pending"})
})

app.listen(PORT , (req , res) => {
    console.log(`server is listening on port:${PORT}`);
    
})


// =>-------------------------------------------<=

// We can use the same code if our paths are same but for different servers like put , patch , delete and post

/* app.route('/api/users/:id')
.get((req , res) => {
    const id = Number(req.params.id); // first i find the id i convert it into number because it is given in the string format
    const user = Users.find((user) => user.id === id)
    return res.send(user)
})
.patch((req , res) => {
    // TODO: Edit the user with id
    return res.json({status:pending})
})
.delete((req , res) => {
    // TODO: Delete the user with id
    return res.json({status:pending})
}) */