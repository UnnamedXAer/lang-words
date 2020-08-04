import React, { useState } from 'react';
import './Auth.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Button';
import { AppContextActions } from '../../context/AppContext';
import Alert from '../UI/Alert/Alert';

const Auth = ({ dispatchApp }) => {
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
			const response = await authenticate();
			if (response) {
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

	const authenticate = () =>
		new Promise((resolve, reject) =>
			setTimeout(() => {
				resolve({ email: 'rkl2@o2.pl' });
			}, 1400)
		);

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
