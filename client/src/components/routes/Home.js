import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import { UserContext } from '../../contexts/UserContext';
import EditModal from '../misc/EditModal';
import DeleteModal from '../misc/DeleteModal';

const Home = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { setShowEdit, setShowDelete } = useContext(ModalContext);
	const { user } = useContext(UserContext);
	const [posts, setPosts] = useState([]);
	const [content, setContent] = useState('');
	const [postId, setPostId] = useState('');
	const [editContent, setEditContent] = useState('');

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

	const handleClickLike = post => {
		fetch(`/api/posts/${post.id}/likes`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data.error) alert(data.error);
				else fetchPosts();
			})
			.catch(err => console.error(err));
	};

	const handleClickEdit = post => {
		setPostId(post.id);
		setEditContent(post.content);
		setShowEdit(true);
	};

	const handleClickDelete = post => {
		setPostId(post.id);
		setShowDelete(true);
	};

	return (
		<Container>
			<EditModal
				postId={postId}
				setPostId={setPostId}
				editContent={editContent}
				setEditContent={setEditContent}
			/>
			<DeleteModal postId={postId} setPostId={setPostId} />
			<br />
			<h1 className='text-center text-primary text-uppercase'>Home</h1>
			<br />
			{isAuthenticated ? (
				<div>
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
				</div>
			) : null}
			<br />
			{posts.map(post => (
				<div key={post.id}>
					<Card>
						<Card.Header>
							<Card.Title className='text-primary'>
								<Link to={`/users/${post.user}`}>
									@{post.user}
								</Link>
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Card.Subtitle className='text-muted'>
								{post.timestamp}
							</Card.Subtitle>
							<Card.Text
								dangerouslySetInnerHTML={{
									__html: post.content
										.replace(
											/@(\S+)/g,
											'<a href="/users/$1" class="text-info">@$1</a>'
										)
										.replace(
											/#(\S+)/g,
											'<a href="/hashtags/$1" class="text-warning">#$1</a>'
										),
								}}
							/>
						</Card.Body>
						<Card.Footer>
							<Row className='justify-content-between'>
								<Row className='align-items-center'>
									{user && post.likes.includes(user.id) ? (
										<ThumbUpIcon
											style={{ cursor: 'pointer' }}
											color='primary'
											className='ml-4 mr-4'
											onClick={() =>
												handleClickLike(post)
											}
										/>
									) : (
										<ThumbUpOutlinedIcon
											style={{ cursor: 'pointer' }}
											color='primary'
											className='ml-4 mr-4'
											onClick={() =>
												handleClickLike(post)
											}
										/>
									)}
									{post.likes.length > 0 ? (
										<Card.Text className='text-muted small'>
											Liked by {post.likes.length} people{' '}
										</Card.Text>
									) : null}
								</Row>
								{user && post.user === user.id ? (
									<div>
										<Button
											variant='success'
											onClick={() =>
												handleClickEdit(post)
											}>
											Edit
										</Button>
										<Button
											variant='danger'
											className='ml-2 mr-2'
											onClick={() =>
												handleClickDelete(post)
											}>
											Delete
										</Button>
									</div>
								) : null}
							</Row>
						</Card.Footer>
					</Card>
					<br />
				</div>
			))}
		</Container>
	);
};

export default Home;
