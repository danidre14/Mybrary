if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use(function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.send('html not found');
        //res.render('404', { url: req.url });
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.send('json not found');
        //res.send({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

app.listen(process.env.PORT || 3000);