import styled from "styled-components";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { orderBy, collection, query, doc, setDoc, serverTimestamp, addDoc, where, getDocs } from "firebase/firestore";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

import { auth, db } from "../utils/firebase";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endofMessageRef = useRef(null);
  const router = useRouter();
  const messageRef = query(collection(db, "chats", router.query.id, "messages"), orderBy("timestamp", "asc"));
  const [messagesSnapshot] = useCollection(messageRef);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => <Message key={message.id} user={message.user} message={message} />);
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();

    //1 update last seen in the user collection
    const docRef = collection(db, "users");
    setDoc(
      doc(docRef, user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
    //2 map the last seen status in the UI
    const messageRef = collection(db, "chats", router.query.id, "messages");
    const q = query(messageRef);
    addDoc(q, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  };

  const recipientRef = query(collection(db, "users"), where("email", "==", getRecipientEmail(chat.users, user)));
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(recipientRef);
  const recipient = recipientSnapshot?.docs[0]?.data();

  const scrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <Container>
      <Header>
        {recipient ? <UserAvatar src={recipient?.photoUrl} /> : <UserAvatar>{recipientEmail[0]}</UserAvatar>}

        <HeaderInfo>
          <h3>{recipient?.displayName || recipientEmail}</h3>
          {recipientSnapshot ? (
            <span>
              Last Active:{" "}
              {recipient?.lastSeen.seconds ? <TimeAgo datetime={Date(recipient?.lastSeen.seconds)} /> : "unavailable"}
            </span>
          ) : (
            <span>Loading Last Active....</span>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endofMessageRef} />
      </MessageContainer>
      <InputContainer>
        <SentimentSatisfiedAltIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  width: 100%;
  background-color: white;
  background-color: whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  ${"" /* margin: 0  0 0; */}
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
    margin-top: 0;
  }
  > span {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 76vh;
`;
const EndOfMessage = styled.div`
  margin-bottom: 55px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 11px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: whiteSmoke;
`;
const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 10px;
  position: stickt;
  bottom: 0;
  z-index: 100;
  background-color: white;
  border: none;
  border-radius: 5px;
  margin: 0 15px;
  :focus {
    outline: none;
  }
`;
