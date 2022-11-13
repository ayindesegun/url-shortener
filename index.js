require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrls')

const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('e don connect')
    })
    .catch((err) => {
        console.log(err)
    }) 

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls : shortUrls})
}) 

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({ full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    if (shortUrl == null) {
        return res.sendStatus(404)
    }
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)

})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is up and running on port 5000')
})