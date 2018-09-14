const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')

const PORT = 3050
const app = express()
const staticPath = path.join(__dirname, './static')
const day = 86400*1000
const validIncrements = {
  'day': day,
  'week': day * 7,
  // 'month': day * 30,
  // 'year': day * ,
  'alltime': ''
}

app
  .use(bodyParser.json())
  .use(express.static(staticPath))
  .get('/api/get_images', (req, res) => {
    const { timePeriod = 'alltime' } = req.query

    if (!(timePeriod in validIncrements)) {
      return res.send(400).send('invalid increment')
    }
    db('images')
      .orderBy('timestamp', 'asc')
      .then(rows => {
        res.json(rows)
      })
  })
  .post('/api/add_image', (req, res) => {
    const KEY = process.env.SECRET_KEY || ''
    if (KEY !== req.body.key) {
      return res.send(401).send('unauthenticated')
    }

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
      .catch(() => {
        res.status(400).send('already sent request')
      })
  })

app.listen(PORT, () => {
  console.log(`App is listening on PORT:${PORT}`)
})
