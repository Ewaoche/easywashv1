const Repository = require('../../Repository');
const Pricing = require('../../models/Pricing');

class PricingRepository extends Repository {
    constructor() {
        super(Pricing);
    }

}

module.exports = (new PricingRepository());