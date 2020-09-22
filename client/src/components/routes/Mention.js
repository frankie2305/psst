import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import { AuthContext } from '../../contexts/AuthContext';
import Post from '../misc/Post';

const Mention = ({ match }) => {
	const { mention } = match.params;
	const { isAuthenticated } = useContext(AuthContext);
	const [dataFetched, setDataFetched] = useState(false);
	const [userExists, setUserExists] = useState(true);
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/mentions/${mention}`)
			.then(res => res.json())
			.then(data => {
				if (data.error) setUserExists(false);
				else setPosts(data);
			})
			.catch(err => console.error(err))
			.finally(() => setDataFetched(true));
	};

	useEffect(fetchPosts);

	if (dataFetched)
		if (isAuthenticated)
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
		else return <Redirect to='/' />;
	else
		return (
			<div className='d-flex justify-content-center'>
				<Spinner animation='border' variant='primary' />
			</div>
		);
};

export default Mention;
