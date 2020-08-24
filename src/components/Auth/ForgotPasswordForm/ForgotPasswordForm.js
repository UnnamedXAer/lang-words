import React, { useState, useContext } from 'react';
import './ForgotPasswordForm.css';
import { Link, useHistory } from 'react-router-dom';
import { FirebaseContext } from '../../../context/FirebaseContext';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert/Alert';
import withAuthContainer from '../withAuthContainer';

const ForgotPasswordForm = () => {
	const firebase = useContext(FirebaseContext);
	const history = useHistory();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('test@test.com');
	const [emailError, setEmailError] = useState(null);
	const [success, setSuccess] = useState(false);

	const submitHandler = async (ev) => {
		ev.preventDefault();
		const emailValue = email.trim();
		if (!emailValue) {
			return setEmailError('Email Address is required');
		}
		setLoading(true);
		try {
			const res = await firebase.resetPassword(email);
			console.log('res', res);
			setSuccess(true);
		} catch (err) {
			setError(err.message);
		}
		setLoading(false);
	};
	return (
		<>
			<h1>Restore Password</h1>
			{success ? (
				<Alert>Check your email to continue.</Alert>
			) : (
				<form onSubmit={submitHandler}>
					<label>
						Email Address
						<Input
							name="email"
							type="email"
							onChange={(ev) => setEmail(ev.target.value)}
							disabled={loading}
							value={email}
						/>
						{emailError && (
							<p className="auth-helper-text auth-helper-text-error">
								{emailError}
							</p>
						)}
					</label>
					<div className="forgot-password-actions">
						<Link className="auth-helper-link" to={{ pathname: '/' }}>
							Back
						</Link>
						<Button loading={loading}>Reset</Button>
					</div>
				</form>
			)}
			{error && <Alert severity="error">{error}</Alert>}
		</>
	);
};

export default withAuthContainer(ForgotPasswordForm);
