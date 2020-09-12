import React, { useContext, useEffect } from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import { UserContext } from '../../contexts/UserContext';

const CustomNavBar = () => {
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { setShowSignup, setShowLogin, setShowLogout } = useContext(
		ModalContext
	);
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (token)
			fetch('/api/users/retrieve', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})
				.then(res => res.json())
				.then(data => setUser(data))
				.catch(err => console.error(err))
				.finally(() => setIsAuthenticated(true));
		else setIsAuthenticated(false);
	});

	return (
		<NavBar expand='lg' bg='dark' variant='dark'>
			<NavBar.Brand href='/'>¡Psst!</NavBar.Brand>
			<NavBar.Text>Social Network Redefined</NavBar.Text>
			<NavBar.Toggle aria-controls='nav' />
			<NavBar.Collapse id='nav' className='justify-content-end'>
				{isAuthenticated ? (
					<>
						<NavBar.Text className='text-primary mr-3'>
							Logged in as {user.id}
						</NavBar.Text>
						<Image
							style={{ width: 28, height: 28 }}
							className='mr-3'
							src={user.avatar}
							thumbnail
							roundedCircle
							fluid
						/>
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
