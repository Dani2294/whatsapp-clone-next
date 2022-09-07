import { useEffect } from "react";
import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase-config";
import Login from "./login";
import Loading from "../components/Loading";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (user) {
			const userRef = doc(db, "user/" + user?.uid);
			setDoc(
				userRef,
				{
					name: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					lastSeen: serverTimestamp(),
				},
				{ merge: true }
			);
		}
	}, [user]);

	if (loading) return <Loading />;

	if (!user) return <Login />;

	return <Component {...pageProps} />;
}

export default MyApp;
