
import {createServer} from "node:http"
import {check, create, findOne, liste} from "./blockchain.js";
import {NotFoundError} from "./errors.js";

createServer(async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${req.headers.host}`)
        const endpoint = `${req.method}:${url.pathname}`

        let results

        try {
            switch (endpoint) {
                case 'GET:/blockchain':
                    results = await liste(req, res, url)
                    break
                case 'GET:/integrity':
                    results = await check(req, res, url)
                    break
                case 'POST:/blockchain/find':
                    results = await findOne(req, res)
                    break
                case 'POST:/blockchain':
                    results = await create(req, res)
                    break

                default :
                    res.writeHead(404)
            }
            if (results !== null ) {
                res.write(JSON.stringify(results))
            }
        } catch (erreur) {
            if (erreur instanceof NotFoundError) {
                res.writeHead(404)
            } else {
                throw erreur
            }
        }
        res.end()
    }
).listen(3000)
