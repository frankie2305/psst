const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
	username: String,
	password: String,
	avatar: String,
	follows: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.set('toJSON', {
	transform: (doc, obj) => {
		obj.id = obj._id.toString();
		delete obj._id;
		delete obj.__v;
		delete obj.password;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
