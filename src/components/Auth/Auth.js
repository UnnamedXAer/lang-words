import React, { useState, useEffect } from 'react';
import './Auth.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Button';
import { AppContextActions } from '../../context/AppContext';
import Alert from '../UI/Alert/Alert';

const Auth = ({ dispatchApp }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [values, setValues] = useState({ email: 'test@test.com', password: 'qwe123' });
	const [formErrors, setFormErrors] = useState({ email: null, password: null });

	useEffect(() => {
		const user = localStorage.getItem('user');
		if (user) {
			dispatchApp({
				type: AppContextActions.AUTHENTICATE,
				payload: {
					user: JSON.parse(user),
				},
			});
		}
	}, []);

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
			const credentials = {
				email,
				password,
			};
			const response = await authenticate(credentials);
			if (response) {
				localStorage.setItem(
					'user',
					JSON.stringify({ email: credentials.email })
				);
				dispatchApp({
					type: AppContextActions.AUTHENTICATE,
					payload: { user: { email: values.email } },
				});
			} else throw new Error('Authentication failed, please try again.');
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	const authenticate = (credentials) =>
		new Promise((resolve, reject) => resolve({ credentials }));

	return (
		<div className="auth-container">
			<div className="auth">
				<h1>Authenticate</h1>
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
					<Button loading={loading}>Authenticate</Button>
				</form>
				{error && <Alert severity="error">{error}</Alert>}
			</div>
		</div>
	);
};

export default Auth;
