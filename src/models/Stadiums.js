const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { generatorTime } = require('../utils/shared');
const { common } = require('./Common');
const ObjectId = mongoose.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
const stadiumsBase = {
    name: {
        type: String, trim: true, required: true,
    },
    address: {
        type: String, trim: true, required: true,
    },
    price: {
        type: Number, trim: true, default: 0,
    },
    phoneNumber: {
        type: String, trim: true, default: ''
    },
    image: {
        type: String, trim: true,
    },
}
const stadiums = { ...stadiumsBase, ...common };
const stadiumsSchema = new Schema(stadiums, { versionKey: false });
stadiumsSchema.plugin(mongoosePaginate);
const stadiumModels = mongoose.model('stadiums', stadiumsSchema);
module.exports = stadiumModels;