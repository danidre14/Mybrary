if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

// const initializePassport = require('./passport-config');
// initializePassport(
//     passport,
//     uName => users.find(user => user.uName === uName)
// );

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const error404Router = require('./routes/error404');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({limit: '10mb', extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //dont save variables if nothing has changed
    saveUninitialized: false //dont save empty value in session if there is no value
    //, cookie: {secure: true} //for https sites
}))
app.use(passport.initialize());
app.use(passport.session());


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to Mongoose'));


app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);

app.use(error404Router); //make sure to put this after all routes



app.listen(process.env.PORT || 3000);