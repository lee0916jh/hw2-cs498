const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()

app.use(bodyParser.json())

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'hw2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

})

app.get('/greeting', (req, res) => {
    res.send('Hello World!')
})

app.post('/register/:username', (req, res) => {
    let username = req.params.username
    let query = 'INSERT INTO Users WHERE username = ?'

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

    res.send(200)
})

app.get('/list', (req, res) => {
    let query = 'SELECT * FROM Users'
    let query_res = null;
    db.query(
        query,
        (err, results, fields) => {
            if (err)
                console.log(err)
            else {
                query_res = results
                console.log(results)
                console.log(fields)
            }
        }
    )
    
    res.send(query_res)
})

PORT = 80
app.listen(PORT, () =>
    console.log('Listening ' + PORT)
)