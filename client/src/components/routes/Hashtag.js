import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Post from '../misc/Post';

const Hashtag = ({ match }) => {
	const { hashtag } = match.params;
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/hashtags/${hashtag}`)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err));
	};

	useEffect(fetchPosts);

	return (
		<Container>
			{posts.length > 0 ? (
				<>
					<br />
					<h1 className='text-center text-primary'>
						Posts with hashtag #{hashtag}
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
				<>
					<br />
					<h1 className='text-center text-danger'>
						No posts with hashtag #{hashtag} exist!
					</h1>
					<br />
				</>
			)}
		</Container>
	);
};

export default Hashtag;
