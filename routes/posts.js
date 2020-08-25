const fs = require('fs');
const uuid = require('uuid');

const postRoutes = require('express').Router();
const json = fs.readFileSync('sampledata.json');
const data = JSON.parse(json);

postRoutes.get('/', (req, res) => {
	res.json(data.posts);
});

postRoutes.get('/:id', (req, res) => {
	const { id } = req.params;
	const post = data.posts.find(post => post.id === id);
	if (post) res.json(post);
	else res.status(404).json({ error: 'Post Not Found' });
});

postRoutes.post('/', (req, res) => {
	const newPost = { id: uuid.v4(), ...req.body, likes: [] };
	data.posts = [newPost, ...data.posts];
	fs.writeFileSync('sampledata.json', JSON.stringify(data, null, 4));
	res.status(201).json(newPost);
});

postRoutes.put('/:id', (req, res) => {
	const { id } = req.params;
	const postToUpdate = data.posts.find(post => post.id === id);
	if (postToUpdate) {
		const updatedPost = { ...postToUpdate, ...req.body };
		data.posts = data.posts.map(post =>
			post.id === id ? updatedPost : post
		);
		fs.writeFileSync('sampledata.json', JSON.stringify(data, null, 4));
		res.status(200).json(updatedPost);
	} else res.status(404).json({ error: 'Post Not Found' });
});

postRoutes.delete('/:id', (req, res) => {
	const { id } = req.params;
	const postToDelete = data.posts.find(post => post.id === id);
	if (postToDelete) {
		data.posts = data.posts.filter(post => post.id !== id);
		fs.writeFileSync('sampledata.json', JSON.stringify(data, null, 4));
		res.status(200).json(postToDelete);
	} else res.status(404).json({ error: 'Post Not Found' });
});

module.exports = postRoutes;
