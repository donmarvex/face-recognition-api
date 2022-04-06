const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: 'process.env.DATABASE_URL',
        ssl : true
    }
});

const app = express();

app.use(express.json());
app.use(cors());


// ----------- ENDPOINTS -----------

// ----------- ROOT / --------------
app.get('/', (req, res) => {
    res.send("success");
});

// Using dependency injection to inject what 
// handleSignin, handleRegister, handleProfileGet, handleImage needs

// -------- /signin ----------------
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
// -------- /register --------------
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
// -------- /profile/:id -----------
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
// -------- /image -----------------
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
// -------- /imageurl -----------------
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT, ()=> {
    console.log(`app is running on port ${process.env.PORT}`);
});

/*
/ --> res = this is working
/signin --> POST = respond with success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

DATABASE QUERIES FOR CREATING TABLES
createdb -U psql 'table_name'
psql -U postgres table_name
Using pgAdmin

CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0
);

// db.select('*').from('users').then(data => {
//     console.log(data);
// });
*/