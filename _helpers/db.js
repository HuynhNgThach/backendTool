const config = require('../config.json')
const mongoose = require('mongoose')


try {
    const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
    mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
    mongoose.Promise = global.Promise;
} catch (error) {
    console.log(error);
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose connect successful");
});
module.exports = {
    User: require('../users/user.model'),
    RefreshToken: require('../users/refresh-token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}