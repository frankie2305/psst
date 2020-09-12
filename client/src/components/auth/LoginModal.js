import React, { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';

const LoginSchema = yup.object({
	id: yup.string().trim().required('Username is required'),
	password: yup.string().trim().required('Password is required'),
});

const LoginModal = () => {
	const { setIsAuthenticated } = useContext(AuthContext);
	const { showLogin, setShowLogin, setShowSignup } = useContext(ModalContext);
	const [error, setError] = useState('');

	return (
		<Formik
			initialValues={{ id: '', password: '' }}
			validationSchema={LoginSchema}
			onSubmit={(values, actions) => {
				actions.resetForm();

				fetch('/api/users/login', {
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
							setShowLogin(false);
							setIsAuthenticated(true);
						}
					})
					.catch(err => console.error(err));
			}}>
			{props => {
				const hideLogin = () => {
					props.resetForm();
					props.setErrors({});
					setShowLogin(false);
				};

				return (
					<Modal show={showLogin} onHide={hideLogin}>
						<Modal.Header closeButton>
							<Modal.Title>Login Form</Modal.Title>
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
								<Form.Text className='text-muted'>
									Don't have an account? Sign up{' '}
									<span
										style={{ cursor: 'pointer' }}
										className='text-primary'
										onClick={() => {
											hideLogin();
											setShowSignup(true);
										}}>
										here
									</span>
									.
								</Form.Text>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={hideLogin}>
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

export default LoginModal;
