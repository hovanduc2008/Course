const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const {errorHandler} = require('./middleware/errorHandler')
const {logger} = require('./middleware/logEvents');
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')

const PORT = process.env.PORT || 3000

const app = express();


// Custom middleware Logger
app.use(logger)

// Handle options check before - CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions))


// build-in middleware to handle urlencode from data
app.use(express.urlencoded({
    extended: true,
}))

// build-in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())


// Serve static files
app.use('/',express.static(path.join(__dirname, '/public')))


// Route
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))


app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'))




app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile('views/404.html', {
            root: __dirname
        });
    } else if(req.accepts('json')) {
        res.send({
            "error": "404 Not Found",
        });
    } else {
        res.type('txt').send('404 Not Found');
    }
})


// Custom Middleware Error Logger
app.use(errorHandler)

app.listen(PORT, () => {
    return console.log('Listening on port ' + PORT);
})