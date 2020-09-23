import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import Post from '../misc/Post';
import User from '../misc/User';

const Profile = ({ match }) => {
	const { username } = match.params;
	const { isAuthenticated } = useContext(AuthContext);
	const { user: currentUser, setUser: setCurrentUser } = useContext(
		UserContext
	);
	const [dataFetched, setDataFetched] = useState(false);
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [followers, setFollowers] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/users/${username}`)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err));
	};

	const fetchFollowers = () => {
		fetch(`/api/users/${username}/followers`)
			.then(res => res.json())
			.then(data => setFollowers(data))
			.catch(err => console.error(err));
	};

	const handleClick = () => {
		fetch(`/api/users/${username}/follows`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data.error) alert(data.error);
				else setCurrentUser(data);
			})
			.catch(err => console.error(err));
	};

	useEffect(() => {
		fetch(`/api/users/${username}`)
			.then(res => res.json())
			.then(data => {
				if (!data.error) {
					setUser(data);
					fetchPosts();
					fetchFollowers();
				}
			})
			.catch(err => console.error(err))
			.finally(() => setDataFetched(true));
	});

	if (dataFetched)
		if (isAuthenticated) {
			return (
				<Container>
					<br />
					{user ? (
						<>
							<h1 className='text-center text-primary'>
								{username}'s Profile
							</h1>
							<br />
							<Row>
								<Col xs={12} md={4}>
									<User user={user} />
									{user.id === currentUser.id ? (
										<Accordion>
											<Card>
												<Card.Header>
													<Accordion.Toggle
														as={Button}
														variant='link'
														eventKey='0'
														className='text-success'>
														Followers (
														{followers.length})
													</Accordion.Toggle>
												</Card.Header>
												<Accordion.Collapse eventKey='0'>
													<Card.Body>
														{followers.length ===
														0 ? (
															<Card.Text className='text-success'>
																You don't have
																any followers
															</Card.Text>
														) : (
															<ListGroup variant='flush'>
																{followers.map(
																	follower => (
																		<ListGroup.Item
																			key={
																				follower.id
																			}
																			action
																			href={`/users/${follower.username}`}
																			className='text-success'>
																			@
																			{
																				follower.username
																			}
																		</ListGroup.Item>
																	)
																)}
															</ListGroup>
														)}
													</Card.Body>
												</Accordion.Collapse>
											</Card>
											<Card>
												<Card.Header>
													<Accordion.Toggle
														as={Button}
														variant='link'
														eventKey='1'
														className='text-danger'>
														Following (
														{user.follows.length})
													</Accordion.Toggle>
												</Card.Header>
												<Accordion.Collapse eventKey='1'>
													<Card.Body>
														{user.follows.length ===
														0 ? (
															<Card.Text className='text-danger'>
																You don't follow
																anybody!
															</Card.Text>
														) : (
															<ListGroup variant='flush'>
																{user.follows.map(
																	follow => (
																		<ListGroup.Item
																			key={
																				follow.id
																			}
																			action
																			href={`/users/${follow.username}`}
																			className='text-danger'>
																			@
																			{
																				follow.username
																			}
																		</ListGroup.Item>
																	)
																)}
															</ListGroup>
														)}
													</Card.Body>
												</Accordion.Collapse>
											</Card>
										</Accordion>
									) : currentUser.follows.includes(
											user.id
									  ) ? (
										<Button
											variant='danger'
											block
											onClick={handleClick}>
											Unfollow
										</Button>
									) : (
										<Button
											variant='success'
											block
											onClick={handleClick}>
											Follow
										</Button>
									)}
									<Button
										variant='info'
										block
										href={`/mentions/${username}`}>
										Mentions of {username}
									</Button>
								</Col>
								<Col xs={12} md={8}>
									<h2 className='text-center text-warning'>
										Posts ({posts.length})
									</h2>
									{posts.length === 0 ? (
										<h3 className='text-center text-info'>
											{username} doesn't have any posts!
										</h3>
									) : (
										<>
											<br />
											{posts.map(post => (
												<Post
													key={post.id}
													post={post}
													fetchPosts={fetchPosts}
												/>
											))}
										</>
									)}
								</Col>
							</Row>
						</>
					) : (
						<>
							<h1 className='text-center text-danger'>
								User {username} does not exist!
							</h1>
						</>
					)}
					<br />
				</Container>
			);
		} else return <Redirect to='/' />;
	else
		return (
			<div className='d-flex justify-content-center'>
				<Spinner animation='border' variant='primary' />
			</div>
		);
};

export default Profile;
