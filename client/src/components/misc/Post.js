import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import { ModalContext } from '../../contexts/ModalContext';
import { UserContext } from '../../contexts/UserContext';

const Post = ({ post, fetchPosts }) => {
	const {
		setPostId,
		setShowEdit,
		setShowDelete,
		setEditContent,
	} = useContext(ModalContext);
	const { user } = useContext(UserContext);

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
		<>
			<Card>
				<Card.Header>
					<Card.Title className='text-primary'>
						<Link to={`/users/${post.user}`}>@{post.user}</Link>
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
									onClick={() => handleClickLike(post)}
								/>
							) : (
								<ThumbUpOutlinedIcon
									style={{ cursor: 'pointer' }}
									color='primary'
									className='ml-4 mr-4'
									onClick={() => handleClickLike(post)}
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
									onClick={() => handleClickEdit(post)}>
									Edit
								</Button>
								<Button
									variant='danger'
									className='ml-2 mr-2'
									onClick={() => handleClickDelete(post)}>
									Delete
								</Button>
							</div>
						) : null}
					</Row>
				</Card.Footer>
			</Card>
			<br />
		</>
	);
};

export default Post;
