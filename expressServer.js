import express from 'express'
import fs, { writeFile } from 'node:fs'
import { readFile } from 'node:fs/promises'
// const API_TOKEN = 'asdasd111'
const server = express()
const port = 3000
// const logger = (req, res, next) => {
//     console.log(req.method, req.url)
//     next()
// }
// const auth = (req, res, next) => {
//     const auth = req.get('Authorization') || ''
//     const token = auth.split(' ')[1]
//     console.log(token)
//     if (token === API_TOKEN) {
//         next()
//     } else {
//         res.sendStatus(401)
//     }
// }
// server.use(logger)
// server.use(auth)

server.get('/', (req, res, next) => {
    res.send('blah')
})

server.get('/pets', (req, res, next) => {
    readFile('pets.json', 'utf-8')
        .then((string) => {
            const pets = JSON.parse(string)
            res.send(pets)
        })
        .catch((error) => {
            next(error)
        })
})

server.post('/pets', (res, req) => {
    //read pets.json, parse into obj
    const newPets = req.body

    readFile('pets.json', 'utf-8').then((string) => {
        const pets = JSON.parse(string)
        pets.push(newPets)
        return writeFile('pets.json', JSON.stringify(pets)).then(() => {
            res.send(newPet)
        })
    })
    //push to new pet to body
    // write back to pets.json
})

server.get('/pets/:petIndex', (req, res) => {
    let petIndexNum = Number(Object.values(req.params))
    readFile('pets.json', 'utf-8')
        .then((string) => {
            const pets = JSON.parse(string)
            if (Number.isNaN(petIndexNum)) {
                res.sendStatus(422)
            } else if (petIndexNum === undefined) {
                res.sendStatus(404)
            } else if (petIndexNum >= pets.length) {
                res.status(404).send('Pet not found')
            } else {
                res.send(pets[petIndexNum])
            }
        })
        .catch((error) => {
            next(error)
        })
})

server.listen(port, () => {
    console.log('something something')
})
