import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
	const [hide, setHide] = useState(true);
	const [user] = useAuthState(auth);
	return (
		<>
			<Head>
				<title>Chat with {getRecipientEmail(chat.users, user)}</title>
			</Head>
			<Container hide={hide}>
				<Sidebar setHide={setHide} />
				<ChatContainer hide={hide}>
					<BackIcon onClick={() => setHide(!hide)}>
						<ArrowBackIosIcon />
					</BackIcon>
					<ChatScreen chat={chat} messages={messages} />
				</ChatContainer>
			</Container>
		</>
	);
}

export default Chat;

export async function getServerSideProps(context) {
	const ref = doc(db, "chats/" + context.query.id);

	// Prep the messages on the server
	const q = query(collection(db, `chats/${context.query.id}/messages`), orderBy("timestamp", "asc"));
	const messagesRes = await getDocs(q);

	const messages = messagesRes?.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((messages) => ({
			...messages,
			timestamp: messages.timestamp.toDate().getTime(),
		}));

	// Prep the chats
	const chatRes = await getDoc(ref);
	const chat = {
		id: chatRes.id,
		...chatRes.data(),
	};

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
	};
}

const Container = styled.div`
	display: ${({ hide }) => (hide ? "block" : "flex")};
	@media (min-width: 550px) {
		display: flex;
	}
`;

const ChatContainer = styled.div`
	display: ${({ hide }) => (hide ? "none" : "block")};
	flex: 100%;
	overflow: scroll;
	height: 100vh;
	position: relative;

	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	@media (min-width: 550px) {
		flex: 1;
		display: block;
	}
`;

const BackIcon = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	position: absolute;
	top: 90px;
	left: 10px;
	background-color: #fff;
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
	z-index: 5000;

	& > svg {
		height: 20px;
		width: 20px;
		margin-left: 5px;
	}

	@media (min-width: 550px) {
		display: none;
	}
`;
