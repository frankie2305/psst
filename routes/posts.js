const fs = require('fs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const postRoutes = require('express').Router();

const json = fs.readFileSync('sampledata.json');
const data = JSON.parse(json);

const getJwt = req => {
	const authorization = req.get('authorization');
	return authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null;
};

postRoutes.get('/', (req, res) => {
	res.json(data.posts);
});

postRoutes.get('/:id', (req, res) => {
	const { id } = req.params;
	const post = data.posts.find(post => post.id === id);
	if (post) res.json(post);
	else res.status(404).json({ error: 'Post not found' });
});

postRoutes.post('/', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const user = jwt.verify(token, '¡Psst!');
		if (user.id) {
			const newPost = {
				id: uuid.v4(),
				user: user.id,
				...req.body,
				likes: [],
			};
			data.posts = [newPost, ...data.posts];
			fs.writeFileSync('sampledata.json', JSON.stringify(data, null, 4));
			res.status(201).json(newPost);
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

postRoutes.put('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const user = jwt.verify(token, '¡Psst!');
		if (user.id) {
			const { id } = req.params;
			const postToUpdate = data.posts.find(post => post.id === id);
			if (postToUpdate) {
				const { timestamp, content } = req.body;
				if (postToUpdate.user === user.id || (!timestamp && !content)) {
					const updatedPost = { ...postToUpdate, ...req.body };
					data.posts = data.posts.map(post =>
						post.id === id ? updatedPost : post
					);
					fs.writeFileSync(
						'sampledata.json',
						JSON.stringify(data, null, 4)
					);
					res.json(updatedPost);
				} else
					res.status(401).json({
						error: "You don't have permission to edit this post",
					});
			} else res.status(404).json({ error: 'Post not found' });
		} else res.status(401).json({ error: 'Token invalid or expired' });
	} else res.status(401).json({ error: 'Token missing' });
});

postRoutes.delete('/:id', (req, res) => {
	const token = getJwt(req);
	if (token) {
		const user = jwt.verify(token, '¡Psst!');
		if (user.id) {
			const { id } = req.params;
			const postToDelete = data.posts.find(post => post.id === id);
			if (postToDelete) {
				if (postToDelete.user === user.id) {
					data.posts = data.posts.filter(post => post.id !== id);
					fs.writeFileSync(
						'sampledata.json',
						JSON.stringify(data, null, 4)
					);
					res.json({ message: 'Post deleted' });
				} else
					res.status(401).json({
						error: "You don't have permission to delete this post",
					});
			} else res.status(404).json({ error: 'Post not found' });
		} else res.status(401).json({ error: 'Token invalid' });
	} else res.status(401).json({ error: 'Token missing' });
});

module.exports = postRoutes;
