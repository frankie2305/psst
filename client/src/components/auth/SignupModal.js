import React, { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import { UserContext } from '../../contexts/UserContext';

const SignupSchema = yup.object({
	id: yup
		.string()
		.trim()
		.required('Username is required')
		.min(5, 'Username must be at least 5 characters long'),
	password: yup
		.string()
		.trim()
		.required('Password is required')
		.test(
			'length',
			'Password must be between 8 and 20 characters long',
			value => value && value.length >= 8 && value.length <= 20
		),
	_password: yup
		.string()
		.trim()
		.required('Password confirmation is required')
		.oneOf([yup.ref('password')], 'Passwords must match'),
});

const SignupModal = () => {
	const { setIsAuthenticated } = useContext(AuthContext);
	const { showSignup, setShowSignup, setShowLogin } = useContext(
		ModalContext
	);
	const { setUser } = useContext(UserContext);
	const [error, setError] = useState('');

	return (
		<Formik
			initialValues={{ id: '', password: '', _password: '' }}
			validationSchema={SignupSchema}
			onSubmit={(values, actions) => {
				actions.resetForm();

				fetch('/api/users/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(values),
				})
					.then(res => res.json())
					.then(data => {
						if (data.error) setError(data.error);
						else {
							setUser(data);
							localStorage.setItem('token', data.token);
							setShowSignup(false);
							setIsAuthenticated(true);
						}
					})
					.catch(err => console.error(err));
			}}>
			{props => {
				const hideSignup = () => {
					props.resetForm();
					props.setErrors({});
					setShowSignup(false);
				};
				return (
					<Modal show={showSignup} onHide={hideSignup}>
						<Modal.Header closeButton>
							<Modal.Title>Signup Form</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form>
								<Alert
									variant='danger'
									show={error ? true : false}
									onClose={() => setError('')}
									dismissible>
									{error}
								</Alert>
								<Form.Group>
									<Form.Label>Username</Form.Label>
									<Form.Control
										type='text'
										placeholder='Enter username'
										value={props.values.id}
										onChange={props.handleChange('id')}
										onBlur={props.handleBlur(
											'id'
										)}></Form.Control>
									<Form.Text className='text-danger'>
										{props.touched.id && props.errors.id}
									</Form.Text>
								</Form.Group>
								<Form.Group>
									<Form.Label>Password</Form.Label>
									<Form.Control
										type='password'
										placeholder='Enter password'
										value={props.values.password}
										onChange={props.handleChange(
											'password'
										)}
										onBlur={props.handleBlur(
											'password'
										)}></Form.Control>
									<Form.Text className='text-danger'>
										{props.touched.password &&
											props.errors.password}
									</Form.Text>
								</Form.Group>
								<Form.Group>
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type='password'
										placeholder='Re-enter password'
										value={props.values._password}
										onChange={props.handleChange(
											'_password'
										)}
										onBlur={props.handleBlur(
											'_password'
										)}></Form.Control>
									<Form.Text className='text-danger'>
										{props.touched._password &&
											props.errors._password}
									</Form.Text>
								</Form.Group>
								<Form.Text className='text-muted'>
									Already have an account? Log in{' '}
									<span
										style={{ cursor: 'pointer' }}
										className='text-primary'
										onClick={() => {
											hideSignup();
											setShowLogin(true);
										}}>
										here
									</span>
									.
								</Form.Text>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={hideSignup}>
								Cancel
							</Button>
							<Button
								variant='primary'
								onClick={props.handleSubmit}>
								Submit
							</Button>
						</Modal.Footer>
					</Modal>
				);
			}}
		</Formik>
	);
};

export default SignupModal;
