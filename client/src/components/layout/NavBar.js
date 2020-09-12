import React, { useContext } from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';

const CustomNavBar = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { setShowSignup, setShowLogin, setShowLogout } = useContext(
		ModalContext
	);

	return (
		<NavBar expand='lg' bg='dark' variant='dark'>
			<NavBar.Brand href='/'>¡Psst!</NavBar.Brand>
			<NavBar.Text>Social Media Redefined</NavBar.Text>
			<NavBar.Toggle aria-controls='nav' />
			<NavBar.Collapse id='nav' className='justify-content-end'>
				{isAuthenticated ? (
					<>
						<NavBar.Text className='text-primary mr-3'>
							Logged in as ...
						</NavBar.Text>
						<Button
							variant='outline-primary'
							onClick={() => setShowLogout(true)}>
							Log out
						</Button>
					</>
				) : (
					<>
						<Button
							variant='outline-primary'
							onClick={() => setShowSignup(true)}
							className='mr-3'>
							Sign up
						</Button>
						<Button
							variant='outline-primary'
							onClick={() => setShowLogin(true)}>
							Log in
						</Button>
					</>
				)}
			</NavBar.Collapse>
		</NavBar>
	);
};

export default CustomNavBar;
