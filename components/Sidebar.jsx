import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase-config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, query, where } from "firebase/firestore";
import Chat from "./Chat";

function Sidebar({ setHide }) {
	const [user] = useAuthState(auth);
	const userChatRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
	const [chatsSnapshot] = useCollection(userChatRef);

	const createChat = () => {
		const input = window.prompt("Please enter an email address for the user you wish to chat with");

		if (!input) return null;

		if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
			// Add the chat to the db "chats" collection
			addDoc(collection(db, "chats"), {
				users: [user.email, input],
			});
		}
	};

	const chatAlreadyExists = (targetEmail) =>
		!!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === targetEmail)?.length > 0);

	return (
		<Container>
			{/* HEADER */}
			<Header>
				<div onClick={() => signOut(auth)}>
					{user?.photoURL ? (
						<UserAvatar src={user?.photoURL} />
					) : (
						<UserAvatar>{user?.email[0].toUpperCase()}</UserAvatar>
					)}
				</div>
				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>

			{/* SEARCH BOX */}
			<Search>
				<SearchIcon />
				<SearchInput placeholder="Search chats" />
			</Search>

			{/* NEW CHAT BUTTON */}
			<NewChatButton onClick={createChat}>Start a new chat</NewChatButton>

			{/* CHATS LIST */}
			{chatsSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} setHide={setHide} />
			))}
		</Container>
	);
}

export default Sidebar;

const Container = styled.div`
	flex: 0.45;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	/* min-width: 300px;
	max-width: 350px; */
	width: 100%;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	@media (min-width: 550px) {
		min-width: 300px;
		max-width: 350px;
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: white;
`;

const IconsContainer = styled.div``;
const UserAvatar = styled(Avatar)`
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`;
const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
	padding-left: 4px;
`;

const NewChatButton = styled(Button)`
	width: 100%;

	&&& {
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
	}
`;
