import { useEffect, useRef, useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import TimeAgo from "timeago-react";
import EmojiPicker from "emoji-picker-react";
import { auth, db } from "../firebase-config";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

function ChatScreen({ chat, messages }) {
	const [input, setInput] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const endOfMessagesRef = useRef(null);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [messagesSnapshot] = useCollection(
		query(collection(db, `chats/${router.query.id}/messages`), orderBy("timestamp", "asc"))
	);
	const [recipientSnapshot] = useCollection(
		query(collection(db, "user"), where("email", "==", getRecipientEmail(chat.users, user)))
	);
	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(chat.users, user);

	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }}
				/>
			));
		} else {
			return JSON.parse(messages).map((message) => <Message key={message.id} user={message.user} message={message} />);
		}
	};

	const sendMessage = (e) => {
		e.preventDefault();

		// Update last seen
		const userRef = doc(db, "user/" + user?.uid);
		setDoc(
			userRef,
			{
				lastSeen: serverTimestamp(),
			},
			{ merge: true }
		);

		// add message to the db
		const messagesRef = collection(db, `chats/${router.query.id}/messages`);
		addDoc(messagesRef, {
			timestamp: serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		});

		setInput("");
		scrollToBottom();
	};

	const scrollToBottom = () => {
		endOfMessagesRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	useEffect(() => scrollToBottom(), []);

	const addEmojiToInput = (emojiObject, event) => {
		setInput((prev) => prev + emojiObject.emoji);
		//setShowEmojiPicker(false);
	};

	return (
		<Container>
			<Header>
				{recipient ? (
					<UserAvatar src={recipient?.photoURL} />
				) : (
					<UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
				)}
				<HeaderInfo>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>
							Last active:{" "}
							{recipient?.lastSeen?.toDate() ? <TimeAgo datetime={recipient?.lastSeen?.toDate()} /> : "Unavailable"}
						</p>
					) : (
						<p>Loading status...</p>
					)}
				</HeaderInfo>
				<HeaderIcons>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</HeaderIcons>
			</Header>

			<MessagesContainer>
				{showMessages()}
				<EndOfMessages ref={endOfMessagesRef} />
			</MessagesContainer>

			<InputContainer onSubmit={sendMessage}>
				{showEmojiPicker && (
					<div style={{ width: "100%", marginBottom: "10px" }}>
						<EmojiPicker onEmojiClick={addEmojiToInput} />
					</div>
				)}
				<Form>
					<InsertEmoticonIcon style={{ cursor: "pointer" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
					<Input value={input} onChange={({ target }) => setInput(target.value)} />
					<MicIcon />
					<SendButton hidden={!input} type="submit">
						<SendIcon />
					</SendButton>
				</Form>
			</InputContainer>
		</Container>
	);
}

export default ChatScreen;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const Header = styled.div`
	position: sticky;
	top: 0;
	display: flex;
	align-items: center;
	padding: 11px;
	height: 80px;
	width: 100%;
	background-color: #fff;
	border-bottom: 1px solid whitesmoke;
	z-index: 100;
`;

const UserAvatar = styled(Avatar)``;

const HeaderInfo = styled.div`
	margin-left: 15px;
	flex: 1;

	& > h3 {
		margin: 0;
		margin-bottom: 3px;
		font-size: 16px;
	}

	& > p {
		margin: 0;
		font-size: 12px;
		color: gray;
	}
`;

const HeaderIcons = styled.div`
	margin-left: auto;
`;

const MessagesContainer = styled.div`
	flex: 1;
	padding: 30px 10px;
	background-color: #e5ded8;
	max-height: 100%;
	overflow-y: scroll;
`;

const EndOfMessages = styled.div`
	margin-bottom: 50px;
`;

const InputContainer = styled.div`
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: #fff;
	z-index: 100;
`;

const Form = styled.form`
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
`;

const SendButton = styled.button`
	border: none;
	padding: 10px;
	border-radius: 5px;
	background-color: #fff;
	cursor: pointer;

	&:hover {
		background-color: whitesmoke;
	}
`;
