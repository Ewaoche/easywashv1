const Repository = require("../../Repository");
const Review = require('../../models/Review');

class ReviewRepository extends Repository {

    constructor() {
        super(Review);
    }
}


module.exports = (new ReviewRepository());