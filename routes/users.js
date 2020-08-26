const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes = require('express').Router();

const json = fs.readFileSync('sampledata.json');
const data = JSON.parse(json);

const getJwt = req => {
	const authorization = req.get('authorization');
	return authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null;
};

userRoutes.get('/', (req, res) => {
	res.json(data.users);
});

userRoutes.get('/:id', (req, res) => {
	const { id } = req.params;
	const user = data.users.find(user => user.id === id);
	if (user) res.json(user);
	else res.status(404).json({ error: 'User not found' });
});

userRoutes.post('/signup', (req, res) => {
	const { id, password } = req.body;
	const user = data.users.find(user => user.id === id);
	if (user)
		res.status(400).json({
			error: 'A user with that username already exists',
		});
	else
		bcrypt
			.hash(password, 13)
			.then(hash => {
				const newUser = {
					id,
					password: hash,
					avatar: `http://robohash.org/${id}`,
					follows: [],
				};
				data.users = [newUser, ...data.users];
				fs.writeFileSync(
					'sampledata.json',
					JSON.stringify(data, null, 4)
				);
				res.status(201).json(newUser);
			})
			.catch(err => console.error(err));
});

userRoutes.post('/login', (req, res) => {
	const { id, password } = req.body;
	const user = data.users.find(user => user.id === id);
	if (user)
		bcrypt
			.compare(password, user.password)
			.then(match => {
				if (match) {
					const token = jwt.sign(user, '¡Psst!', {
						algorithm: 'HS512',
						expiresIn: '7d',
					});
					res.json({ token, ...user });
				} else
					res.status(401).json({
						error: 'Username and password do not match',
					});
			})
			.catch(err => console.error(err));
	else
		res.status(400).json({
			error: 'No user with that username exists',
		});
});

userRoutes.put('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const user = jwt.verify(token, '¡Psst!');
		if (user.id) {
			const { oldId } = req.params;
			const userToUpdate = data.users.find(user => user.id === oldId);
			if (userToUpdate) {
				const { newId, password, avatar } = req.body;
				if (user.id === oldId || (!newId && !password && !avatar)) {
					const updatedUser = { ...userToUpdate, ...req.body };
					data.users = data.users.map(user =>
						user.id === oldId ? updatedUser : user
					);
					fs.writeFileSync(
						'sampledata.json',
						JSON.stringify(data, null, 4)
					);
					res.json(updatedUser);
				} else
					res.status(401).json({
						error: "You don't have permission to edit this account",
					});
			} else res.status(404).json({ error: 'User not found' });
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

userRoutes.delete('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const user = jwt.verify(token, '¡Psst!');
		if (user.id) {
			const { id } = req.params;
			const userToDelete = data.users.find(user => user.id === id);
			if (userToDelete) {
				if (userToDelete.id === user.id) {
					data.users = data.users.filter(user => user.id !== id);
					fs.writeFileSync(
						'sampledata.json',
						JSON.stringify(data, null, 4)
					);
					res.json({ message: 'User deleted' });
				} else
					res.status(401).json({
						error:
							"You don't have permission to delete this account",
					});
			} else res.status(404).json({ error: 'User not found' });
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

module.exports = userRoutes;
