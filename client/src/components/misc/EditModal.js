import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ModalContext } from '../../contexts/ModalContext';

const EditModal = ({ postId, setPostId, editContent, setEditContent }) => {
	const { showEdit, setShowEdit } = useContext(ModalContext);

	const hideEdit = () => {
		setPostId('');
		setEditContent('');
		setShowEdit(false);
	};

	const handleChange = e => {
		setEditContent(e.target.value);
	};

	const handleSubmit = () => {
		fetch(`/api/posts/${postId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				timestamp: new Date().toLocaleString(),
				content: editContent,
			}),
		})
			.then(res => res.json())
			.then(data => {
				hideEdit();
				if (data.error) alert(data.error);
				else window.location.reload();
			})
			.catch(err => console.error(err));
	};

	return (
		<Modal show={showEdit} onHide={hideEdit}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Post</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder="What's on your mind?"
							value={editContent}
							onChange={handleChange}></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={hideEdit}>
					Cancel
				</Button>
				<Button variant='primary' onClick={handleSubmit}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditModal;
