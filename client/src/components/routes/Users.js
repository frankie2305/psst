import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import User from '../misc/User';

const Users = () => {
	const [dataFetched, setDataFetched] = useState(false);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch('/api/users')
			.then(res => res.json())
			.then(data => setUsers(data))
			.catch(err => console.error(err))
			.finally(() => setDataFetched(true));
	});

	if (dataFetched)
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
	else
		return (
			<div className='d-flex justify-content-center'>
				<Spinner animation='border' variant='primary' />
			</div>
		);
};

export default Users;
