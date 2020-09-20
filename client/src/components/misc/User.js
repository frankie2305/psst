import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { UserContext } from '../../contexts/UserContext';

const User = ({ user }) => {
	const { user: currentUser } = useContext(UserContext);

	return (
		<Link to={`/users/${user.id}`}>
			<Card border={user.id === currentUser.id && 'primary'}>
				<Card.Img variant='top' src={user.avatar}></Card.Img>
				<Card.Body>
					<Card.Title className='text-center text-primary'>
						@{user.id}
					</Card.Title>
				</Card.Body>
			</Card>
		</Link>
	);
};

export default User;
