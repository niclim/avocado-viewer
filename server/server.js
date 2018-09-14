const express = require('express')
const path = require('path')

const PORT = 3050
const app = express()
const staticPath = path.join(__dirname, './static')

app
  .use(express.static(staticPath))

app.listen(PORT, () => {
  console.log(`App is listening on PORT:${PORT}`)
})
