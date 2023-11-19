const StadiumsModel = require('../models/Stadiums');
const BookingsModel = require('../models/Bookings');

const express = require('express');
const moment = require('moment-timezone');

const router = express.Router();
const {
    responseSuccess, responseError,
    regExpSearch, convertToObjectId,
    generatorTime,
    isEmpty,
} = require('../utils/shared');
// Create a new stadiums
router.route('/stadiums/create').post(async (req, res) => {
    try {
        const { name, address, image, price, phoneNumber } = req.body;
        const result = await StadiumsModel.create({
            name,
            address,
            image,
            price,
            phoneNumber,
            createdAt: generatorTime(),
        })
        if (!result) return res.json(responseError("Create stadium fail", {}))
        return res.json(responseSuccess("Create stadium successfully", result))
    } catch (errors) {
        console.log(errors, 'errors')
        return res.json(responseError("Something went wrong!", errors))
    }
});
// Update a player
router.route('/stadiums/update').put(async (req, res) => {
    try {
        const { name, address, image, stadiumObjId } = req.body;
        const set = {};
        const conditions = {
            _id: convertToObjectId(stadiumObjId),
        }
        if (name) {
            set.name = name;
        }
        if (address) {
            set.address = address;
        }
        if (image) {
            set.image = image;
        }
        if (phoneNumber) {
            set.phoneNumber = phoneNumber;
        }
        if (price) {
            set.price = price;
        }
        const result = await StadiumsModel.findOneAndUpdate(conditions, set, { new: true });
        if (result) {
            return res.json(responseSuccess("Edit a stadium successfully!", result));
        }
        return res.json(responseError("Edit a stadium fail", {}))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
});
// Delete a player
router.route('/stadiums/delete').delete(async (req, res) => {
    try {
        const { stadiumObjId } = req.body;
        const conditions = {
            _id: convertToObjectId(stadiumObjId),
        }
        const set = {
            isDeleted: "Yes",
        }
        const result = await StadiumsModel.findOneAndUpdate(conditions, set, { new: true });
        if (result) {
            return res.json(responseSuccess("Delete a stadium successfully!", result));
        }
        return res.json(responseError("Delete a stadium fail", {}))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
});
// List stadiums
router.route('/stadiums/list').get(async (req, res) => {
    try {
        const { page = 1, limit = 9, search = '' } = req.query;
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'items',
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'nextPage',
            prevPage: 'prevPage',
            totalPages: 'pageCount',
            pagingCounter: 'pagingCounter',
            meta: 'paginator',
        };
        const conditions = {
            isDeleted: "No"
        };
        if (req.query.search) {
            conditions.$or = [
                { name: regExpSearch(search) },
                { address: regExpSearch(search) },
            ]
        }
        const populate = [];
        const options = {
            sort: {
                createdAt: -1,
            },
            page: +page,
            limit: +limit,
            lean: true,
            populate,
            customLabels: myCustomLabels,
        };
        const result = await StadiumsModel.paginate(conditions, options);
        if (result) {
            return res.json(responseSuccess("List stadium successfully!", result));
        }
        return res.json(responseSuccess("List stadium successfully!", []))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
});
router.get('/stadiums/info/:stadiumObjId', async (req, res) => {
    try {
        const { stadiumObjId } = req.params;
        const conditions = {
            _id: convertToObjectId(stadiumObjId),
        }
        const result = await StadiumsModel.findOne(conditions);
        if (result) {
            return res.json(responseSuccess("Find a stadium successfully!", result));
        }
        return res.json(responseError("Find a stadium fail", {}))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
})
router.route('/stadiums/book').post(async (req, res) => {
    try {
        const { fullName, email, phone, stadiumObjId,
            bookingDate, userObjId } = req.body
        const findBooking = await BookingsModel.findOne({
            stadiumObjId: convertToObjectId(stadiumObjId),
        }).lean();
        if (!isEmpty(findBooking)) {
            const existedBookingDate = findBooking.bookingDate;
            if (moment(existedBookingDate, 'YYYY-MM-DD').isSame(bookingDate, 'day')) {
                return res.json(responseError("This stadium is full in this day, please choose another day!"))
            }
        }
        const result = await BookingsModel.create({
            fullName,
            email,
            phone,
            bookingDate,
            stadiumObjId: convertToObjectId(stadiumObjId),
            createdAt: generatorTime(),
            createdBy: convertToObjectId(userObjId),
        })
        if (!result) return res.json(responseError("Booking fail", {}))
        return res.json(responseSuccess("Book stadium successfully", result))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
});
router.route('/bookings/list').get(async (req, res) => {
    try {
        const { page = 1, limit = 10, userObjId } = req.query;
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'items',
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'nextPage',
            prevPage: 'prevPage',
            totalPages: 'pageCount',
            pagingCounter: 'pagingCounter',
            meta: 'paginator',
        };
        const conditions = {
            isDeleted: "No"
        };
        if (req.query.userObjId) {
            conditions.userObjId = convertToObjectId(userObjId)
        }
        const populate = [];
        const options = {
            sort: {
                createdAt: -1,
            },
            page: +page,
            limit: +limit,
            lean: true,
            populate,
            customLabels: myCustomLabels,
        };
        const result = await BookingsModel.paginate(conditions, options);
        if (result) {
            return res.json(responseSuccess("List booking successfully!", result));
        }
        return res.json(responseSuccess("List booking successfully!", []))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
});
module.exports = router;