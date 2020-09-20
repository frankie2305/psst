import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ModalContext } from '../../contexts/ModalContext';

const DeleteModal = () => {
	const { postId, setPostId, showDelete, setShowDelete } = useContext(
		ModalContext
	);

	const hideDelete = () => {
		setPostId('');
		setShowDelete(false);
	};

	const handleSubmit = () => {
		fetch(`/api/posts/${postId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				hideDelete();
				if (data.error) alert(data.error);
				else window.location.reload();
			})
			.catch(err => console.error(err));
	};

	return (
		<Modal show={showDelete} onHide={hideDelete}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Post</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this post? This action is
				irreversible.
			</Modal.Body>
			<Modal.Footer>
				<Button variant='danger' onClick={handleSubmit}>
					Sure, please delete it
				</Button>
				<Button variant='success' onClick={hideDelete}>
					Nah, please keep it
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteModal;
