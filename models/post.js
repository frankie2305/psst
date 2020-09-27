const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	timestamp: Number,
	content: String,
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

postSchema.set('toJSON', {
	transform: (doc, obj) => {
		obj.id = obj._id.toString();
		delete obj._id;
		delete obj.__v;
	},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
