require('dotenv').config();
const jwt = require('jsonwebtoken');
const postRoutes = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');

const secret = process.env.SECRET;

const getJwt = req => {
	const authorization = req.get('authorization');
	return authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null;
};

postRoutes.get('/', (req, res) => {
	Post.find({})
		.populate('user')
		.sort('-timestamp')
		.exec((err, posts) => {
			if (err) console.error(err.message);
			else res.json(posts);
		});
});

postRoutes.get('/users/:username', (req, res) => {
	const { username } = req.params;
	User.findOne({ username }).then(user => {
		if (user) {
			Post.find({ user: user._id.toString() })
				.populate('user')
				.sort('-timestamp')
				.exec((err, posts) => {
					if (err) console.error(err.message);
					else res.json(posts);
				});
		} else res.status(404).json({ error: 'User not found' });
	});
});

postRoutes.get('/mentions/:mention', (req, res) => {
	const { mention } = req.params;
	User.findOne({ username: mention }).then(user => {
		if (user) {
			Post.find({})
				.populate('user')
				.exec((err, posts) => {
					if (err) console.error(err.message);
					else
						res.json(
							posts.filter(
								post =>
									new RegExp(`@${mention}\\W+`, 'g').test(
										post.content
									) || post.content.endsWith(`@${mention}`)
							)
						);
				});
		} else res.status(404).json({ error: 'User not found' });
	});
});

postRoutes.get('/hashtags/:hashtag', (req, res) => {
	const { hashtag } = req.params;
	Post.find({})
		.populate('user')
		.exec((err, posts) => {
			if (err) console.error(err.message);
			else
				res.json(
					posts.filter(
						post =>
							new RegExp(`#${hashtag}\\W+`, 'g').test(
								post.content
							) || post.content.endsWith(`#${hashtag}`)
					)
				);
		});
});

postRoutes.post('/', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id } = jwt.verify(token, secret);
		if (id) {
			const post = new Post({
				user: id,
				...req.body,
			});
			User.findById(id).then(user => {
				if (user) {
					user.posts = [post._id, ...user.posts];
					user.save().then(user =>
						post.save().then(post => res.status(201).json(post))
					);
				} else res.status(404).json({ error: 'User not found' });
			});
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

postRoutes.put('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id: userId } = jwt.verify(token, secret);
		if (userId) {
			const { id } = req.params;
			const { timestamp, content } = req.body;
			Post.findById(id).then(post => {
				if (post) {
					post.timestamp = timestamp;
					post.content = content;
					post.save().then(post => res.json(post));
				} else res.status(404).json({ error: 'Post not found' });
			});
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

postRoutes.put('/:id/likes', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id: likerId } = jwt.verify(token, secret);
		if (likerId) {
			const { id } = req.params;
			Post.findById(id).then(post => {
				if (post) {
					let likes = post.likes;
					if (likes.includes(likerId))
						likes = likes.filter(
							like => like.toString() !== likerId
						);
					else likes = [likerId, ...likes];
					post.likes = likes;
					post.save().then(post => res.json(post));
				} else res.status(404).json({ error: 'Post not found' });
			});
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

postRoutes.delete('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id: userId } = jwt.verify(token, secret);
		if (userId) {
			const { id } = req.params;
			Post.findById(id).then(post => {
				if (post) post.deleteOne().then(post => res.json(post));
				else res.status(404).json({ error: 'Post not found' });
			});
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

module.exports = postRoutes;
