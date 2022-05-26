import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc, orderBy, query } from "firebase/firestore";
import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import { db } from "../../utils/firebase";

const Chat = ({ chat, messages }) => {
  return (
    <Container>
      <Head>
        <title>Chat</title>
      </Head>
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;
//pre-fetching the data before the user sees the page
export async function getServerSideProps(context) {
  //prep the chat
  const chatRef = doc(db, "chats", context.query.id);
  const chatRes = await getDoc(chatRef);
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  //prep the messages on the server
  const messageRef = collection(db, "chats", context.query.id, "messages");
  const q = query(messageRef, orderBy("timestamp", "asc"));

  const messageRes = await getDocs(q);
  const messages = messageRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  width: 75%;
`;
const ChatContainer = styled.div`
  overflow: scroll;
  height: 100%;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
