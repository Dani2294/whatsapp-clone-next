import { BounceLoader } from "react-spinners";
import styled from "styled-components";

function Loading() {
	return (
		<Container>
			<LoadingContainer>
				<Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
				<BounceLoader color="#219F14" />
			</LoadingContainer>
		</Container>
	);
}

export default Loading;

const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;
`;

const LoadingContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Logo = styled.img`
	height: 200px;
	width: 200px;
	margin-bottom: 50px;
`;
