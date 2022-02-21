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
    const { username, isSecondaryRequest } = req.body
    try {
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
        if (!isSecondaryRequest) {
            axios.post("http://" + otherHost + '/register', {
                username,
                isSecondaryRequest: true
            }).catch()
        }
    } catch (e) {
        console.log(e)
    } finally {
        res.send(200)
    }

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
                const list = results.map(elem => elem.username)
                res.json(list)
            }
        }
    )
})

app.post('/clear', (req, res) => {
    const query = 'DELETE FROM Users'
    db.execute(query)
    res.send(200)
})

PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)