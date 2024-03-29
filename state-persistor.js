const express = require("express")

const app = express()
const http = require('http').Server(app);
const fs = require("fs").promises

const port = 8086

// to test POST with CURL:
// curl -X POST http://localhost:8086 -H "Content-Type: text/plain" -H "persistor-secret: hello" -d "content of the state"
// curl http://localhost:8086 -H "persistor-secret: hello" -o state.json

// to test persistor:
// npx cross-env PERSISTOR_SECRET=xxx nodemon state-persistor.js

app.use((req, res, next) =>
{
    const secret = req.headers["persistor-secret"]
    if (secret === process.env.PERSISTOR_SECRET)
        next()
    else
        res.sendStatus(403)
})

app.get("/", async (req, res) =>
{
    try
    {
        fs.readFile("persisted-state")
            .then((state) => res.end(state))
            .catch((err) =>
            {
                console.error(err)
                res.sendStatus(500)
            })
    }
    catch (e)
    {
        console.log(e)
        res.sendStatus(500)
    }
})

app.use(express.text({ limit: "5mb" }));

app.post("/", async (req, res) =>
{
    try
    {
        const state = req.body

        await fs.writeFile("persisted-state", state)
        res.end()
    }
    catch (e)
    {
        console.log(e)
        res.sendStatus(500)
    }
})

http.listen(port, "0.0.0.0");

console.log("Server running on http://localhost:" + port);
