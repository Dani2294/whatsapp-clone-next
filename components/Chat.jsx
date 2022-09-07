import { Avatar } from "@material-ui/core";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase-config";
import getRecipientEmail from "../utils/getRecipientEmail";

function Chat({ id, users, setHide }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [recipientSnapshot] = useCollection(
		query(collection(db, "user"), where("email", "==", getRecipientEmail(users, user)))
	);

	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(users, user);

	const enterChat = () => {
		router.push(`/chat/${id}`);
		setHide && setHide(false);
	};

	const activeChat = id === router.query?.id || false;

	return (
		<Container onClick={enterChat} active={activeChat}>
			{recipient ? (
				<UserAvatar src={recipient?.photoURL} />
			) : (
				<UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
			)}
			<Text>{recipientEmail}</Text>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-word;
	width: 100%;

	background-color: ${({ active }) => (active ? "#e5ded8" : "white")};

	:hover {
		background-color: #e5ded8;
	}
`;

const UserAvatar = styled(Avatar)`
	margin: 5px 15px 5px 5px;
`;

const Text = styled.p``;
