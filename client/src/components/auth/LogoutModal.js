import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import { UserContext } from '../../contexts/UserContext';

const LogoutModal = () => {
	const { setIsAuthenticated } = useContext(AuthContext);
	const { showLogout, setShowLogout } = useContext(ModalContext);
	const { setUser } = useContext(UserContext);

	return (
		<Modal show={showLogout} onHide={() => setShowLogout(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Logging Out</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure you want to log out?</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={() => {
						setUser(null);
						localStorage.removeItem('token');
						setShowLogout(false);
						setIsAuthenticated(false);
						window.location.reload();
					}}>
					Sure, let me log out
				</Button>
				<Button variant='primary' onClick={() => setShowLogout(false)}>
					Nah, I changed my mind
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LogoutModal;
