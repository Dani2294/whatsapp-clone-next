import { signInWithPopup } from "firebase/auth";
import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase-config";

function Login() {
	const signIn = () => {
		signInWithPopup(auth, provider).catch(alert);
	};
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>
			<LoginContainer>
				<Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
				<Button variant="outlined" onClick={signIn}>
					Sign in with Google
				</Button>
			</LoginContainer>
		</Container>
	);
}

export default Login;

const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;
`;

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100px;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 4px 15px -3px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.img`
	height: 200px;
	width: 200px;
	margin-bottom: 50px;
`;
