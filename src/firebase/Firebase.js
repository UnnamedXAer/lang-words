import firebaseApp from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

class Firebase {
	constructor() {
		console.log('About to init Firebase');
		this.app = firebaseApp.initializeApp(firebaseConfig);
		this.auth = this.app.auth();
		this.db = this.app.database();
		this.ServerValueNS = firebaseApp.database.ServerValue;
	}

	setLoggedUserId = () => {
		this.loggedUserId = this.auth.currentUser ? this.auth.currentUser.uid : null;
	};

	authorize = (isSignIn, email, password) => {
		return isSignIn
			? this.auth.signInWithEmailAndPassword(email, password)
			: this.auth.createUserWithEmailAndPassword(email, password);
	};

	logOut = () => this.auth.signOut();

	resetPassword = (email, actions) => {
		return this.auth.sendPasswordResetEmail(email, { url: window.location.origin });
	};

	updatePassword = (password) => {
		return this.auth.currentUser.updatePassword(password);
	};

	words = () => {
		return this.db.ref(`/${this.loggedUserId}/words`);
	};
}

export default Firebase;
