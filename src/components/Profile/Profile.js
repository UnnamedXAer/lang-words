import React, { useContext } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Profile = () => {
	const [{ user }] = useContext(AppContext);

	return (
		<div className="profile">
			<h1>Profile</h1>
			<div>
				<p>{user.email}</p>
				<p>Last login time: {user.lastLoginTime.toLocaleString()}</p>
				<p>Registration time: {user.creationTime.toLocaleString()}</p>
			</div>
			<div className="profile-update-password-container">
				<Link to={{ pathname: '/update-password' }}>Update Password</Link>
			</div>
		</div>
	);
};

export default Profile;
