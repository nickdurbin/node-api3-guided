const express = require("express")
const helmet = require('helmet')
const logger = require('./middleware/logger')
const agent = require('./middleware/agent')
const hubRouter = require("./routers/hub")
const welcomeRouter = require("./routers/welcome")

const server = express()

// third party middleware from NPM
server.use(helmet())
// custom middleware function written by us
server.use(logger())
server.use(agent("insomnia"))
// built-in middleware from express
server.use(express.json())
// Bring all our subroutes into the main application
// (Remember, subroutes can have more children routers)
server.use("/", welcomeRouter)
server.use("/api/hubs", hubRouter)

server.use((res, req) => {
  res.status(404).json({ message: "You have ventured into the abyss!"})
})

server.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    message: "An error occurred, please try again later."
  })
})

const port = 4000
const host = "http://localhost:"

server.listen(port, () => {
  console.log(`\n*** Server Running on ${host}${port} ***\n`)
})