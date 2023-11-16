const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { generatorTime } = require('../utils/shared');
const { common } = require('./Common');
const ObjectId = mongoose.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
const { RENTAL_TIME } = require('../utils/constants');
const RENTAL_TIME_ENUM = Object.values(RENTAL_TIME);
const productsBase = {
    name: {
        type: String, trim: true, required: true,
    },
    address: {
        type: String, trim: true, required: true,
    },
    order: [{
        type: Number, trim: true, required: true, _id: false
    }],
    image: {
        type: String, trim: true,
    },
}
const products = { ...productsBase, ...common };
const productsSchema = new Schema(products, { versionKey: false });
productsSchema.plugin(mongoosePaginate);
const productsModels = mongoose.model('products', productsSchema);
module.exports = productsModels;