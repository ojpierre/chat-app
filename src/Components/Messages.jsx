import React, { useContext, useEffect, useState } from "react";
import Message from "./Message.jsx";
import styled from "styled-components";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";
import { ChatContext } from "../Context/ChatContext.jsx";

const Container = styled.div`
  background-color: #fef0e7;
  padding: 10px;
  height: calc(100% - 160px);
  overflow-y: auto; /* Set to "auto" to show the scrollbar when needed */
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #f3f3f3 #ccc; /* For Firefox */

  /* For Webkit-based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
`;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data || !data.chatId) {
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc && doc.exists()) {
        const docData = doc.data();
        if (docData && docData.messages) {
          setMessages(docData.messages);
        } else {
          setMessages([]);
        }
      }
    });

    return () => {
      unSub();
    };
  }, [data]);

  return (
    <Container>
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </Container>
  );
};

export default Messages;
