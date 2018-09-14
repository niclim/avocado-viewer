const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')

const PORT = 3050
const app = express()
const staticPath = path.join(__dirname, './static')

app
  .use(bodyParser.json())
  .use(express.static(staticPath))
  .post('/api/add_image', (req, res) => {
    const { name } = req.body
    const imgTimestamp = String(
      new Date(
        name.replace(/^img-(.+)\.jpg$/i, '$1')
      ).getTime()
    )

    db('images')
      .insert({
        image: name,
        time_taken: imgTimestamp
      })
      .then(() => {
        res.status(200).send('ok')
      })
  })

app.listen(PORT, () => {
  console.log(`App is listening on PORT:${PORT}`)
})
