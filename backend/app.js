require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./graphql/schema');
require('./auth');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const { authenticateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

mongoose.connect('mongodb://localhost:27017/mongodb-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', authenticateToken, eventRoutes);

app.use('/graphql', (req, res, next) => {
  console.log('GraphQL Request:', req.body); // Journaliser les requêtes GraphQL
  next();
}, graphqlHTTP({
  schema,
  graphiql: true,
}));

app.use(errorHandler);

app.get('/', (req, res) => {
  const { token } = req.query;
  res.redirect(`http://localhost:3001/?token=${token}`);
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;