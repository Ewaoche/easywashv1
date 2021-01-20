const Repository = require("../../Repository");

class ComplainRepository extends Repository {
    constructor() {
        super(Complain);
    }
}

module.exports = (new ComplainRepository());