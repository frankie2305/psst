import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/AuthContext';
import Post from '../misc/Post';

const Home = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [posts, setPosts] = useState([]);
	const [content, setContent] = useState('');

	const fetchPosts = () => {
		fetch('/api/posts')
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err));
	};

	useEffect(fetchPosts);

	const handleChange = e => {
		setContent(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		fetch('/api/posts', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				timestamp: new Date().toLocaleString(),
				content,
			}),
		})
			.then(res => res.json())
			.then(data => {
				setContent('');
				if (data.error) alert(data.error);
				else fetchPosts();
			})
			.catch(err => console.error(err));
	};

	return (
		<Container>
			<br />
			<h1 className='text-center text-primary'>Home</h1>
			<br />
			{isAuthenticated && (
				<>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Control
								as='textarea'
								rows={3}
								placeholder="What's on your mind?"
								value={content}
								onChange={handleChange}></Form.Control>
						</Form.Group>
						<Button
							variant='primary'
							type='submit'
							block
							disabled={!content}>
							Submit
						</Button>
					</Form>
					<br />
				</>
			)}
			{posts.map(post => (
				<Post key={post.id} post={post} fetchPosts={fetchPosts} />
			))}
			<br />
		</Container>
	);
};

export default Home;
