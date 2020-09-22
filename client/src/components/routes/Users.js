import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import { AuthContext } from '../../contexts/AuthContext';
import User from '../misc/User';

const Users = () => {
	const { isAuthenticated } = useContext(AuthContext);
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
		if (isAuthenticated)
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
		else return <Redirect to='/' />;
	else
		return (
			<div className='d-flex justify-content-center'>
				<Spinner animation='border' variant='primary' />
			</div>
		);
};

export default Users;
