import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';
import { UserContext } from '../../contexts/UserContext';

const Users = () => {
	const { user: currentUser } = useContext(UserContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch('/api/users')
			.then(res => res.json())
			.then(data => setUsers(data))
			.catch(err => console.error(err));
	});

	return (
		<Container>
			<br />
			<h1 className='text-center text-primary text-uppercase'>Users</h1>
			<br />
			<CardColumns>
				{users.map(user => (
					<Link to={`/users/${user.id}`}>
						<Card
							key={user.id}
							border={user.id === currentUser.id && 'primary'}>
							<Card.Img
								variant='top'
								src={user.avatar}></Card.Img>
							<Card.Body>
								<Card.Title className='text-center text-primary'>
									<Link to={`/users/${user.id}`}>
										@{user.id}
									</Link>
								</Card.Title>
							</Card.Body>
						</Card>
					</Link>
				))}
			</CardColumns>
			<br />
		</Container>
	);
};

export default Users;
