class Repository {

    constructor(Model) {
        this.Model = Model;
    }


    find(condition = {}) {
        return this.Model.find(condition);
    };

    findById(id) {
        return this.Model.findById(id);
    }
}

module.exports = Repository;