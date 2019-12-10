module.exports = (requiredAgent) => (req, res, next) => {
  const userAgent = req.get('User-Agent').toLowerCase()

  if (!userAgent.includes(requiredAgent)) {
    return next(new Error(`Must be using ${requiredAgent}!`))
  }
  next()
}