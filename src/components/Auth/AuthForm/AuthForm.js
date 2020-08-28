import React, { useState, useContext } from 'react';
import './AuthForm.css';
import { Link } from 'react-router-dom';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert/Alert';
import { FirebaseContext } from '../../../context/FirebaseContext';
import withAuthContainer from '../withAuthContainer';

const AuthForm = () => {
	const firebase = useContext(FirebaseContext);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [values, setValues] = useState({ email: '', password: '' });
	const [formErrors, setFormErrors] = useState({ email: null, password: null });

	const formChangeHandler = (ev) => {
		const {
			target: { name, value },
		} = ev;

		setValues((prevState) => ({ ...prevState, [name]: value }));
	};

	const submitHandler = async (ev) => {
		ev.preventDefault();
		const email = values.email.trim();
		const password = values.password;

		let isValid = true;

		if (email === '') {
			isValid = false;
			setFormErrors((prevState) => ({
				...prevState,
				email: 'Email Address is required',
			}));
		} else {
			setFormErrors((prevState) => ({
				...prevState,
				email: null,
			}));
		}
		if (password === '') {
			isValid = false;
			setFormErrors((prevState) => ({
				...prevState,
				password: 'Password is required',
			}));
		} else {
			setFormErrors((prevState) => ({
				...prevState,
				password: null,
			}));
		}

		if (!isValid) {
			return;
		}

		setError(null);
		setLoading(true);
		try {
			await firebase.authorize(isLogin, email, password);
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	return (
		<>
			<h1 className="auth-headline">Lang Word</h1>
			<form onSubmit={submitHandler}>
				<label>
					Email Address
					<Input
						name="email"
						type="email"
						onChange={formChangeHandler}
						disabled={loading}
						value={values.email}
					/>
					{formErrors.email && (
						<p className="auth-helper-text auth-helper-text-error">
							{formErrors.email}
						</p>
					)}
				</label>
				<label>
					Password
					<Input
						name="password"
						type="password"
						onChange={formChangeHandler}
						disabled={loading}
						value={values.password}
					/>
					{formErrors.password && (
						<p className="auth-helper-text auth-helper-text-error">
							{formErrors.password}
						</p>
					)}
				</label>
				<div>
					<p
						role="button"
						tabIndex="0"
						className="auth-helper-link"
						onClick={(ev) => {
							setIsLogin((prevState) => !prevState);
						}}
					>
						Switch to <strong>{isLogin ? 'Registration' : 'Login'}</strong>.
					</p>
				</div>
				<Button btnType="success" loading={loading}>
					{isLogin ? 'Login' : 'Register'}
				</Button>
				{isLogin && (
					<div>
						<Link
							className="auth-helper-link"
							to={{ pathname: '/forgot-password' }}
						>
							Forgot password?
						</Link>
					</div>
				)}
			</form>
			{error && <Alert severity="error">{error}</Alert>}
		</>
	);
};

export default withAuthContainer(AuthForm);
