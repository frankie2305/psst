import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import { AuthContext } from '../../contexts/AuthContext';
import Post from '../misc/Post';

const Hashtag = ({ match }) => {
	const { hashtag } = match.params;
	const { isAuthenticated } = useContext(AuthContext);
	const [dataFetched, setDataFetched] = useState(false);
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/hashtags/${hashtag}`)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err))
			.finally(() => setDataFetched(true));
	};

	useEffect(fetchPosts);

	if (dataFetched)
		if (isAuthenticated)
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
		else return <Redirect to='/' />;
	else
		return (
			<div className='d-flex justify-content-center'>
				<Spinner animation='border' variant='primary' />
			</div>
		);
};

export default Hashtag;
