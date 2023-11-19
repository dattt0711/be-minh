
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
const {
    IS_DELETED,
} = require('../utils/constants');
const { generatorTime } = require('../utils/shared');


const common = {
    isDeleted: { type: String, default: IS_DELETED[200] },
    createdAt: { type: String, default: null },
};
module.exports = {
    common,
};
