const express = require('express');
const bodyParser = require('body-parser');

//database congiguration
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//connection to database
mongoose.connect(dbConfig.url, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('database connection failed...');
    process.exit();
    });

// constant app will represent our application
// app is based on express
const app = express();

//parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//parse requests of content-type -application/json
app.use(bodyParser.json())

//defining a route to our application
app.get('/', (req, res) => {
	res.json({
	"message": "Nothing here, try making some API request."
	});
});

//require Users routes
require('./app/routes/user.route.js')(app);

//listening to requests

app.listen(3000, () => {
    console.log("Server running at port 3000!")
});

//static files
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))



