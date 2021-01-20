const Repository = require("../../Repository");
const Order = require('../../models/Order');

class OrderRepository extends Repository {

    constructor() {
        super(Order);
    }
}


module.exports = (new OrderRepository());