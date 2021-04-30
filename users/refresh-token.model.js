const mongoose = require('mongoose')
const Schema = mongoose.Schema


const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String
})

schema.virtual('isExpired').get(() => {
    return Date.now() >= this.expires
})

schema.virtual('isActive').get(() => {
    return !this.revoked && !this.isExpired
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.id;
        delete ret.user;
    }
});

module.exports = mongoose.model('RefreshToken', schema);