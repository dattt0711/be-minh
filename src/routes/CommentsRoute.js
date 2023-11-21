const express = require('express');
const router = express.Router();
const CommentsModel = require('../models/Comments');
const {
    responseSuccess, responseError,
    regExpSearch, convertToObjectId,
} = require('../utils/shared');
router.get('/comments/list', async (req, res) => {
    try {
        const { stadiumObjId } = req.query;
        const conditions = {
            isDeleted: "No"
        };
        conditions.stadiumObjId = convertToObjectId(stadiumObjId);
        const result = await CommentsModel.find(conditions);
        if (result) {
            return res.json(responseSuccess("List comment successfully!", result));
        }
        return res.json(responseSuccess("List comment successfully!", []))
    } catch (err) {
        console.log(err, 'err')
        return res.json(responseError("Something went wrong!", err))
    }
})

router.post('/comments/create', async (req, res) => {
    try {
        const { comment, brief, rating,
          stadiumObjId, userObjId } = req.body;
        const set = {};
        set.comment = comment;
        set.brief = brief;
        set.rating = rating;
        set.stadiumObjId = convertToObjectId(stadiumObjId);
        // set.userObjId = convertToObjectId(userObjId);
        const result = await CommentsModel.create(set);
        if (result) {
            return res.json(responseSuccess("Create a comment successfully!", result));
        }
        return res.json(responseError("Create a comment fail", {}))
    } catch (err) {
        console.log(err, 'err create')
        return res.json(responseError("Something went wrong!", err))
    }
})



module.exports = router;