const express = require("express")
const messageRouter = require("./message")
const hubs = require("../hubs/hubs-model.js")
const { validateHubId, validateHubData } = require("../middleware/validate")

// Creates a new router, or "sub-application" within our app
// Routers can have their own endpoints, middleware, etc.
const router = express.Router()

// We can nest routers within routers, as deep as we want
router.use("/:id/messages", messageRouter)

// The endpoint is built off of the parent router's endpoint.
// So this endpoint is accessed at /api/hubs/:id
router.get("/", (req, res) => {
  const opts = {
    // These values all comes from the URL's query string
    // (everything after the question mark)
    limit: req.query.limit,
    sortby: req.query.sortby,
    sortdir: req.query.sortdir,
  }

  hubs.find(opts)
    .then(hubs => {
      res.status(200).json(hubs)
    })
    .catch(error => {
      next(error)
    })
})

router.get("/:id", validateHubId(), (req, res) => {
  res.json(req.hub)
})

router.post("/", validateHubData(), (req, res) => {

  hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub)
    })
    .catch(error => {
      next(error)
    })
})

router.put("/:id", validateHubId(), validateHubData(), (req, res) => {
  hubs.update(req.hub.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub)
      }
    })
    .catch(error => {
      next(error)
    })
})

router.delete("/:id", validateHubId(), (req, res) => {
  hubs.remove(req.hub.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The hub has been nuked." })
      }
    })
    .catch(error => {
      next(error)
    })
})

module.exports = router