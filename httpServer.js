import fs from 'node:fs'
import http from 'node:http'

//create a server object:
http.createServer(function (request, response) {
    const petRegExp = /^\/pets\/(\d+)$/
    //if GET to /pets, return pets
    if (request.method === 'GET' && request.url === '/pets') {
        fs.readFile('pets.json', 'utf-8', (error, string) => {
            response.setHeader('Content-Type', 'applications/json')
            // response.write()
            response.end(string)
        })
    } else if (request.method === 'GET' && petRegExp.test(request.url)) {
        const petIndex = Number(request.url.match(petRegExp)[1])
        fs.readFile('pets.json', 'utf-8', (error, string) => {
            response.setHeader('Content-Type', 'applications/json')
            const pets = JSON.parse(string)
            const pet = JSON.stringify(pets[petIndex])
            if (pet !== undefined) {
                response.write(pet)
                response.end()
            } else {
                // console.error(err.stack)
                // response.statusCode = 404
                // res.setHeader('Content-Type', 'text/plain')
                res.end('Not Found')
            }
        })
    } else {
        response.write('Hello World!') //write a response to the client
        response.end() //end the response
    }
}).listen(3000, function () {
    console.log('listening on port 3000')
}) //the server object listens on port 8080
