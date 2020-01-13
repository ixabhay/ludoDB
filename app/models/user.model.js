const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    refid: String,
    refcode: String,
    profilepicture: String
    }, {
        timestamps: true
    });

module.exports = mongoose.model('User', UserSchema);
