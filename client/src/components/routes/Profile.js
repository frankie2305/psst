import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { UserContext } from '../../contexts/UserContext';
import Post from '../misc/Post';
import User from '../misc/User';

const Profile = ({ match }) => {
	const { id } = match.params;
	const { user: currentUser, setUser: setCurrentUser } = useContext(
		UserContext
	);
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [followers, setFollowers] = useState([]);

	const fetchPosts = () => {
		fetch(`/api/posts/users/${id}`)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => console.error(err));
	};

	const fetchFollowers = () => {
		fetch(`/api/users/${id}/followers`)
			.then(res => res.json())
			.then(data => setFollowers(data))
			.catch(err => console.error(err));
	};

	const handleClick = () => {
		fetch(`/api/users/${id}/follows`, {
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
		fetch(`/api/users/${id}`)
			.then(res => res.json())
			.then(data => {
				if (!data.error) {
					setUser(data);
					fetchPosts();
					fetchFollowers();
				}
			})
			.catch(err => console.error(err));
	});

	return (
		<Container>
			<br />
			{user ? (
				<>
					<h1 className='text-center text-primary'>{id}'s Profile</h1>
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
												Followers ({followers.length})
											</Accordion.Toggle>
										</Card.Header>
										<Accordion.Collapse eventKey='0'>
											<Card.Body>
												{followers.length === 0 ? (
													<Card.Text className='text-success'>
														You don't have any
														followers
													</Card.Text>
												) : (
													<ListGroup variant='flush'>
														{followers.map(
															follower => (
																<ListGroup.Item
																	action
																	href={`/users/${follower.id}`}
																	className='text-success'>
																	@
																	{
																		follower.id
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
												Following ({user.follows.length}
												)
											</Accordion.Toggle>
										</Card.Header>
										<Accordion.Collapse eventKey='1'>
											<Card.Body>
												{user.follows.length === 0 ? (
													<Card.Text className='text-danger'>
														You don't follow anybody
													</Card.Text>
												) : (
													<ListGroup variant='flush'>
														{user.follows.map(
															follow => (
																<ListGroup.Item
																	action
																	href={`/users/${follow}`}
																	className='text-danger'>
																	@{follow}
																</ListGroup.Item>
															)
														)}
													</ListGroup>
												)}
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
							) : currentUser.follows.includes(user.id) ? (
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
								href={`/mentions/${user.id}`}>
								Mentions of {user.id}
							</Button>
						</Col>
						<Col xs={12} md={8}>
							<h2 className='text-center text-warning'>
								Posts ({posts.length})
							</h2>
							{posts.length === 0 ? (
								<h3 className='text-center text-info'>
									Start writing your first post today!
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
						User {id} does not exist!
					</h1>
				</>
			)}
			<br />
		</Container>
	);
};

export default Profile;
