module.exports = (app) => {

    var controller = "../controllers/user.controller.js";
    const shortid = require('shortid');
    const users = require(controller);
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            //cb(null, Date.now() + file.originalname);
            cb(null, shortid.generate() + '.png');
        }
    });

    const fileFilter = (req, file, cb) => {
        //reject a file
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG file are allowed!'), false);
        }
    };

    //const upload = multer({ dest: 'uploads/' });
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter

    });

    //create a new user
    app.post('/registeruser', users.create);

    //get all users' information
    app.get('/allusers', users.listAll);

    //get single user with userId
    app.get('/users/:userId', users.findOne);

    //update a user with userId
    app.put('/updateinfo', users.update);

    //delete a User with userId
    app.post('/deleteuser', users.delete);

    //upload image
    app.post('/uploadimage', upload.single('profilePicture'), users.uploadimage);

    //loggin in user
    app.post('/login', users.login);

    //register user
    app.post('/register', users.register);
}