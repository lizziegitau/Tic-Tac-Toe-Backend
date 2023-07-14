const express = require('express')
const { getDb, connectToDb } = require('./db')
const { MongoClient } = require('mongodb')

const app = express()

app.use(express.static('./public'))

let db

connectToDb((err) => {
    if (!err) {
        app.listen('3000', () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})

const connectingToDb = (callback) => {
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) {
            console.error('Failed to connect to the database:', err)
            return callback(err)
        }
      
        db = client.db('your_database_name')
      
        return callback(null)
    })
}

app.post('/games', (req, res) => {
    const gameData = req.body 
  
    db.collection('games').insertOne(gameData, (err, result) => {
        if (err) {
            console.error('Failed to insert game data:', err)
            return res.status(500).json({ error: 'Failed to insert game data' })
        }
      
        res.status(201).json({ message: 'Game data inserted successfully' })
    })
})
