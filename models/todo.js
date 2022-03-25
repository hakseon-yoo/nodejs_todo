const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date,
    order: Number
});

TodoSchema.virtual("todoId").get(function(){
    return this._id.toHexString();
});
TodoSchema.set('toJSON', { //todo 모델이 JSON형태로 변환이 될 때, 버츄얼스키마를 포함한다. 라는 뜻이 된다.
    virtuals: true,
});

module.exports = mongoose.model('Todo', TodoSchema);