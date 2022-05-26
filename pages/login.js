import { IconButton, Button } from "@mui/material";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import Navbar from "../components/Navbar";

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };
  return (
    <>
      <Navbar />
      <Container>
        <Head>
          <title>Login</title>
        </Head>

        <LoginContainer>
          <GIcon />
          {/* <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" /> */}
          <SigninButton onClick={signIn}>Sign in with Google</SigninButton>
        </LoginContainer>
      </Container>
    </>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
`;

const LoginContainer = styled.div`
  min-width: 16rem;
  padding: 4rem;
  align-items: center;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
`;
const SigninButton = styled(Button)`
  width: 100%;
  &&& {
    color: black;
    border: 1px solid whitesmoke;
    :hover {
      background-color: #e1e1e1;
    }
  }
`;
const GIcon = styled(GoogleIcon)`
  margin: 2rem;
  &&& {
    font-size: 3rem;
  }
`;
