import React, { useState, useContext } from 'react';
import './ForgotPasswordForm.css';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../../context/FirebaseContext';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert/Alert';
import withAuthContainer from '../withAuthContainer';

const ForgotPasswordForm = () => {
	const firebase = useContext(FirebaseContext);
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

	const backBtn = (
		<Link className="auth-helper-link" to={{ pathname: '/' }}>
			Back
		</Link>
	);

	return (
		<>
			<h1>Restore Password</h1>
			{success ? (
				<>
					<Alert className="forgot-password-success-alert">
						Message with instruction and link to reset password was sent to
						your email address.
						<br />
						Please, check your mail box to continue.
					</Alert>

					{backBtn}
				</>
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
						{backBtn}
						<Button loading={loading}>Reset</Button>
					</div>
				</form>
			)}
			{error && <Alert severity="error">{error}</Alert>}
		</>
	);
};

export default withAuthContainer(ForgotPasswordForm);
