import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Post from '../misc/Post';
import User from '../misc/User';

const Profile = ({ match }) => {
	const { id } = match.params;
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/users/${id}`)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err));
	};

	useEffect(() => {
		fetch(`/api/users/${id}`)
			.then(res => res.json())
			.then(data => {
				if (!data.error) {
					setUser(data);
					fetchPosts();
				}
			})
			.catch(err => console.error(err));
	});

	return (
		<Container>
			{user ? (
				<>
					<br />
					<h1 className='text-center text-primary'>{id}'s Profile</h1>
					<br />
					<Row>
						<Col xs={12} md={4}>
							<User user={user} />
						</Col>
						<Col xs={12} md={8}>
							{posts.map(post => (
								<Post
									key={post.id}
									post={post}
									fetchPosts={fetchPosts}
								/>
							))}
						</Col>
					</Row>
				</>
			) : (
				<>
					<br />
					<h1 className='text-center text-danger'>User Not Found!</h1>
					<br />
				</>
			)}
		</Container>
	);
};

export default Profile;
