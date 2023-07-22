const express = require('express');
const path = require('path');
const cors = require('cors');


const {errorHandler} = require('./middleware/errorHandler')
const {logger} = require('./middleware/logEvents');
const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 3000

const app = express();



// Custom middleware Logger
app.use(logger)


// Cross Origin Resource Sharing
app.use(cors(corsOptions))


// build-in middleware to handle urlencode from data
app.use(express.urlencoded({
    extended: false,
}))

// build-in middleware for json
app.use(express.json())


// Serve static files
app.use('/',express.static(path.join(__dirname, '/public')))


// Route
app.use('/', require('./routes/root'))
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