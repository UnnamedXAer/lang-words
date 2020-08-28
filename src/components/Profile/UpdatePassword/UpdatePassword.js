import React, { useState, useContext } from 'react';
import './UpdatePassword.css';
import Alert from '../../UI/Alert/Alert';
import Button from '../../UI/Button';
import Input from '../../UI/Input/Input';
import { FirebaseContext } from '../../../context/FirebaseContext';
import { AppContext, AppContextActions } from '../../../context/AppContext';
import { WordsContext, WordsContextActions } from '../../../context/WordsContext';
import { useHistory } from 'react-router-dom';

const UpdatePassword = () => {
	const history = useHistory();
	const firebase = useContext(FirebaseContext);
	const [, dispatchApp] = useContext(AppContext);
	const [, dispatchWords] = useContext(WordsContext);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(null);
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordError, setNewPasswordError] = useState(null);
	const [success, setSuccess] = useState(false);

	const submitHandler = async (ev) => {
		ev.preventDefault();
		setSuccess(false);
		setError(null);
		setPasswordError(null);
		setNewPasswordError(null);
		let isOk = true;
		if (!password) {
			isOk = false;
			setPasswordError('Password is required.');
		}
		if (!newPassword) {
			isOk = false;
			setNewPasswordError('New Password is required.');
		}

		if (isOk) {
			setLoading(true);
			try {
				await firebase.reauthenticate(password);
				await firebase.updatePassword(newPassword);
				setSuccess(true);
				setPassword('');
				setNewPassword('');
			} catch (err) {
				if (err.code === 'auth/too-many-requests') {
					logout();
				}
				if (err.code === 'auth/wrong-password') {
					setError('The password is not correct.');
				} else {
					setError(err.message);
				}
			}
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await firebase.logOut();
		} catch (err) {}
		dispatchApp({
			type: AppContextActions['LOGOUT'],
		});
		dispatchWords({
			type: WordsContextActions['CLEAR_STATE'],
		});
	};

	return (
		<div className="update-password">
			<h1>Update Password</h1>
			<form onSubmit={submitHandler}>
				<label>
					Password
					<Input
						name="password"
						type="password"
						onChange={(ev) => setPassword(ev.target.value)}
						disabled={loading}
						value={password}
					/>
					{passwordError && (
						<p className="update-password-helper-text update-password-helper-text-error">
							{passwordError}
						</p>
					)}
				</label>
				<label>
					New Password
					<Input
						name="newPassword"
						type="password"
						onChange={(ev) => setNewPassword(ev.target.value)}
						disabled={loading}
						value={newPassword}
					/>
					{newPasswordError && (
						<p className="update-password-helper-text update-password-helper-text-error">
							{newPasswordError}
						</p>
					)}
				</label>
				<div className="update-password-actions">
					<Button btnType="success" loading={loading}>
						Update
					</Button>
					<button
						className="update-password-back-button"
						onClick={(ev) => {
							ev.preventDefault();
							history.goBack();
						}}
					>
						Back
					</button>
				</div>
				{(success || error) && (
					<Alert severity={success ? 'success' : 'error'}>
						{success ? 'Password updated.' : error}
					</Alert>
				)}
			</form>
		</div>
	);
};

export default UpdatePassword;
