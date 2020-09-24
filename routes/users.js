require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes = require('express').Router();
const User = require('../models/user');

const secret = process.env.SECRET;

const getJwt = req => {
	const authorization = req.get('authorization');
	return authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null;
};

userRoutes.get('/', (req, res) => {
	User.find({})
		.sort('username')
		.exec((err, users) => res.json(users));
});

userRoutes.get('/retrieve', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id } = jwt.verify(token, secret);
		if (id) User.findById(id).then(user => res.json(user));
		else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

userRoutes.get('/:username', (req, res) => {
	const { username } = req.params;
	User.findOne({ username })
		.populate('follows')
		.populate('posts')
		.exec((err, user) => {
			if (user) res.json(user);
			else res.status(404).json({ error: 'User not found' });
		});
});

userRoutes.get('/:username/followers', (req, res) => {
	const { username } = req.params;
	User.findOne({ username }).then(followedUser => {
		if (followedUser) {
			User.find({}).then(users =>
				res.json(
					users.filter(user =>
						user.follows.includes(followedUser._id.toString())
					)
				)
			);
		} else res.status(404).json({ error: 'User not found' });
	});
});

userRoutes.post('/signup', (req, res) => {
	const { username, password } = req.body;
	User.findOne({ username }).then(user => {
		if (user)
			res.status(400).json({
				error: 'A user with that username already exists',
			});
		else
			bcrypt.hash(password, 13).then(hash => {
				const user = new User({
					username,
					password: hash,
					avatar: `https://robohash.org/${username}`,
				});
				const userForToken = {
					id: user._id,
					username: user.username,
				};
				const token = jwt.sign(userForToken, secret, {
					algorithm: 'HS512',
					expiresIn: '7d',
				});
				user.token = token;
				user.save().then(user => res.status(201).json({ token, user }));
			});
	});
});

userRoutes.post('/login', (req, res) => {
	const { username, password } = req.body;
	User.findOne({ username }).then(user => {
		if (user)
			bcrypt.compare(password, user.password).then(match => {
				if (match) {
					const userForToken = {
						id: user._id,
						username: user.username,
					};
					const token = jwt.sign(userForToken, secret, {
						algorithm: 'HS512',
						expiresIn: '7d',
					});
					res.json({ token, user });
				} else
					res.status(401).json({
						error: 'Username and password do not match',
					});
			});
		else
			res.status(400).json({
				error: 'No user with that username exists',
			});
	});
});

userRoutes.put('/:username/follows', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const { id } = jwt.verify(token, secret);
		if (id) {
			const { username } = req.params;
			User.findOne({ username }).then(user => {
				if (user) {
					User.findById(id).then(follower => {
						const followedId = user._id.toString();
						let follows = follower.follows;
						if (follows.includes(followedId))
							follows = follows.filter(
								follow => follow.toString() !== followedId
							);
						else follows = [followedId, ...follows];
						follower.follows = follows;
						follower.save().then(follower => res.json(follower));
					});
				} else res.status(404).json({ error: 'User not found' });
			});
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

module.exports = userRoutes;
