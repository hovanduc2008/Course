const whiteList = [
    'https://www.google.com.vn', 
    'http://127.0.0.1:5500', 
    'http://localhost:3000'
];
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }else {
            callback(new Error('Not allowed to CORS'), false)
        }
    },
    optionSuccessStatus: 200
}


module.exports = corsOptions