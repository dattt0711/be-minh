const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { generatorTime } = require('../utils/shared');
const { common } = require('./Common');
const ObjectId = mongoose.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
const bookingsBase = {
    fullName: {
        type: String, trim: true,
    },
    email: {
        type: String, trim: true,
    },
    phone: {
        type: String, trim: true,
    },
    bookingDate: {
        type: String, trim: true,
    },
    stadiumObjId: {
        type: ObjectId, trim: true, ref: "stadiums"
    },
    createdBy: {
        type: ObjectId, trim: true, ref: "users", default: null
    }
}
const bookings = { ...bookingsBase, ...common };
const bookingsSchema = new Schema(bookings, { versionKey: false });
bookingsSchema.plugin(mongoosePaginate);
const bookingsModels = mongoose.model('bookings', bookingsSchema);
module.exports = bookingsModels;