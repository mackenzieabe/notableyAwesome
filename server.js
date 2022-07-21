const express = require('express')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.post('/api/notes', (req, res) => {
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
        //req.body.id= notes.length.toString();??
    }

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let db = JSON.parse(data)
        console.log('before push', db)
        db.push(newNote)
        console.log('after push', db)
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            if (err) throw err;
            console.log('Saved a new note')
        })
    })
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log('App listening on http://localhost:' + PORT)
})