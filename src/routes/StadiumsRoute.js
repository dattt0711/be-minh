const StadiumsModel = require('../models/Stadiums');


function StadiumRoute(apiRouter) {
    // Create a new stadiums
    apiRouter.route('/stadiums/create').post(async (req, res) => {
        try {
            const { name, address, image } = req.body;
            const result = await StadiumsModel.create({
                name,
                address,
                image,
            })
            if (!result) return res.json(responseError("Create stadium fail", {}))
            return res.json(responseSuccess("Create stadium successfully", result))
        } catch (errors) {
            return res.json(responseError("Something went wrong!", err))
        }
    });
    // Update a player
    apiRouter.route('/stadiums/update').put(async (req, res) => {
        try {
            const { name, address, image } = req.body;
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
    apiRouter.route('/stadiums/delete').delete(async (req, res) => {
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
    apiRouter.route('/stadiums/list').get(async (req, res) => {
        try {
            const { page = 1 } = req.query;
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
            const populate = [];
            const options = {
                sort: {
                    createdAt: -1,
                },
                page: page,
                limit: limit,
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
    // Check available booking
    // apiRouter.route('/stadiums/checkAvailable').get(stadiumsController.checkAvailable);
}
module.exports = StadiumRoute;