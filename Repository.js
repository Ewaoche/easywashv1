class Repository {

    constructor(Model) {
        this.Model = Model;
    }

    create(obj) {
        return this.Model.create(obj);
    }

    find(condition = {}) {
        return this.Model.find(condition);
    };

    findById(id) {
        return this.Model.findById(id);
    }

    findByIdAndUpdate(id, obj, options) {

        return this.Model.findByIdAndUpdate(id, obj, options);

    }

    findByIdAndDelete(id) {
        return this.Model.findByIdAndDelete(id);
    }
}

module.exports = Repository;