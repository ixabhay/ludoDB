const User = require('../models/user.model.js');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');

const multer = require('multer');

//register a new user
exports.create = (req, res) => {
    refid = req.body.refid;
    //validate the request
    if (!req.body.email) {
        return res.status(400).send({
            message: "User email id cannot be empty"
        });
    }

    //register a user
    const user = new User({
        name: req.body.name || "not defined",
        email: req.body.email,
        refcode: req.body.ref || "DEFAULT",
        refid: shortid.generate()
    });

    //save the user information in database
    user.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while registering new user.."
        });
    });
};

//get all users' data
exports.listAll = (req, res) => {
    User.find().then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while getting all information"
        });
    });
};

//find single user with userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error getting user data with userId: " + req.params.userId
        });
    });

};

//update a user's information base on userId
    exports.update = (req, res) => {
        //validate request
        if (!req.body.email) {
            return res.status(400).send({
                message: "Email ID cannot be left blank"
            });
        }
        //find user by refid and update its name and email        
        User.findOneAndUpdate({ refid: req.body.refid }, {
            name: req.body.name || "not defined",
            email: req.body.email
        }, {
                new: true
            }).then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User not found with userId " + req.body.refid
                    });
                }
                res.send(user);
            }).catch(err => {
                if (!user) {
                    return res.status(404).send({
                        message: "Error updating user with id " + req.body.refid
                    });
                }
                return res.status(500).send({
                    message: "Error updating user with id " + req.body.refid
                });
            });
     };

//delete user with userId
exports.delete = (req, res) => {
    User.findOneAndRemove({ refid: req.body.refid }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.body.refid
            });
        }
        res.send({
            message: "User deleted successfully!"
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'Not Found') {
                return res.status(404).send({
                    message: "User not found with id " + req.body.refid
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.body.refid
            });
        });
    });

};



//update a user's information base on userId
exports.uploadimage = (req, res) => {
    
    console.log(req.file);
    //validate request
    if (!req.body.refid) {
        return res.status(400).send({
            message: "refid cannot be left blank"
        });
    }
    //find user by refid and update its name and email        
    User.findOneAndUpdate({ refid: req.body.refid }, {
       // name: req.body.name || "not defined",
       // email: req.body.email,
        profilepicture: req.file.path
    }, {
            new: true
        }).then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with userId " + req.body.refid
                });
            }
            res.send(user);
        }).catch(err => {
            if (!user) {
                return res.status(404).send({
                    message: "Error updating user with id " + req.body.refid
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.body.refid
            });
        });
};


//find single user with userId
exports.login = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "user not found with id " + req.body.email
            });
        }
        res.send(user);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.body.email
            });
        }
        return res.status(500).send({
            message: "Error getting user data with userId: " + req.body.email
        });
    });

};

//register a new user
exports.register = (req, res) => {

    refid = req.body.refid;
    //dont entertain any empty request
    if (!req.body.email) {
        return res.status(400).send({
            message: "User email id cannot be empty"
        });
    }

    checkEmail(req.body.email, function (err, data) { //Checks if user input is in database already.
        if (err) {
            res.json(err);
        }

        if (data != null) { //If not null then user input is in database already.
            res.json('Email ' + req.body.email + ' is already registed...');
        } else {

            //register a user
            const user = new User({
                name: req.body.name || "not defined",
                email: req.body.email,
                refcode: req.body.ref || "DEFAULT",
                refid: shortid.generate()
            });

            //save the user information in database
            user.save().then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Something went wrong while registering new user.."
                });
            });
        }
    })
};

var checkEmail = function (emailInput, done) { //Check the database if User exists.
    User.findOne({ email: emailInput }, (err, data) => {
        if (err) {
            done(err);
        }
        done(null, data);
    })
};
