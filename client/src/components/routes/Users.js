import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import User from '../misc/User';

const Users = () => {
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
			<h1 className='text-center text-primary'>Users</h1>
			<br />
			<CardColumns>
				{users.map(user => (
					<User key={user.id} user={user} />
				))}
			</CardColumns>
			<br />
		</Container>
	);
};

export default Users;
