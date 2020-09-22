import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Post from '../misc/Post';

const Mention = ({ match }) => {
	const { mention } = match.params;
	const [userExists, setUserExists] = useState(true);
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/mentions/${mention}`)
			.then(res => res.json())
			.then(data => {
				if (data.error) setUserExists(false);
				else setPosts(data);
			})
			.catch(err => console.error(err));
	};

	useEffect(fetchPosts);

	return (
		<Container>
			<br />
			{userExists ? (
				posts.length > 0 ? (
					<>
						<h1 className='text-center text-primary'>
							Mentions of {mention}
						</h1>
						<br />
						{posts.map(post => (
							<Post
								key={post.id}
								post={post}
								fetchPosts={fetchPosts}
							/>
						))}
					</>
				) : (
					<h1 className='text-center text-danger'>
						{mention} hasn't been mentioned in any posts!
					</h1>
				)
			) : (
				<h1 className='text-center text-danger'>
					User {mention} does not exist!
				</h1>
			)}
			<br />
		</Container>
	);
};

export default Mention;
