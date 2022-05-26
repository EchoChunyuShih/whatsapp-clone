import styled from "styled-components";
import { Avatar, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { db, auth } from "../utils/firebase";
import Chat from "./Chat";
import CustomVerticalMore from "./CustomVerticalMore";

const Sidebar = () => {
  const [user] = useAuthState(auth);

  // Create a query against the collection.
  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user.email)
  );
  const [chatSnapshot] = useCollection(userChatRef);

  const chatAlreadyExists = (recipientEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  const createChat = () => {
    const input = prompt(
      "Please enter an email for the user you wish to chat with"
    );
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // adding the chat into the collection 'chat' if
      //1. the email is correct
      //2. the chat doesn't already exist
      //3. the user's email is not equal to the recipient's email.
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  };
  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <CustomVerticalMore />
          </IconButton>
        </IconsContainer>
      </Header>
      <SidebarFunc>
        <Search>
          <SearchIcon />
          <SeacrhInput placeholder="Search in Chat" />
        </Search>
        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
      </SidebarFunc>
      {/* List of Chats */}
      {chatSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  background: #ffffff;
  min-width: 300px;
  max-width: 350px;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;
const SeacrhInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    color: black;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    :hover {
      background-color: whitesmoke;
    }
  }
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const SidebarFunc = styled.div`
  position: sticky;
  top: 80px;
  background-color: white;
  z-index: 100;
`;
