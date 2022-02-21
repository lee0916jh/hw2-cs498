const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const axios = require('axios')

const { otherHost } = require("./host")

const app = express()

app.use(bodyParser.json())

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'prod',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

})

app.get('/greeting', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const { username } = req.body
    let query = 'INSERT INTO Users VALUES (?)'

    db.query(
        query,
        [username],
        (err, results) => {
            if (err)
                console.log(err)
            else
                console.log(results)
        }
    )

    axios.post("http://" + otherHost + '/register', {
        username
    })

    res.send(username)
})

app.get('/list', (req, res) => {
    let query = 'SELECT * FROM Users'

    const result = db.query(
        query,
        (err, results, fields) => {
            if (err)
                console.log(err)
            else {
                console.log(results)
                console.log(fields)
                res.json(results)
            }
        }
    )
})

PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)