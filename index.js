const express = require('express');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const cors = require('cors');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json())
app.use(cookie())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://melyonousi:Jedg8zOavWvOGF6w@node-auth.c1n4tod.mongodb.net/jwt-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('jwt-auth'));
app.use(authRoute)