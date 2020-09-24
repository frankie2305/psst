import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
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
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then(res => res.json())
				.then(data => {
					if (data.error) {
						setUser(null);
						localStorage.removeItem('token');
						setIsAuthenticated(false);
						alert(data.error);
					} else {
						setUser(data);
						setIsAuthenticated(true);
					}
				})
				.catch(err => console.error(err));
		else setIsAuthenticated(false);
	});

	return (
		<NavBar expand='lg' bg='dark' variant='dark' sticky='top'>
			<NavBar.Brand href='/'>¡Psst!</NavBar.Brand>
			<Nav.Link href='/'>Home</Nav.Link>
			<Nav.Link href='/users'>Users</Nav.Link>
			{isAuthenticated && (
				<>
					<Nav.Link href={`/users/${user.username}`}>
						Profile
					</Nav.Link>
				</>
			)}
			<NavBar.Toggle aria-controls='nav' />
			<NavBar.Collapse id='nav' className='justify-content-end'>
				{isAuthenticated ? (
					<>
						<NavBar.Text className='mr-3'>
							Logged in as{' '}
							<Link
								to={`/users/${user.username}`}
								className='text-primary'>
								@{user.username}
							</Link>
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
