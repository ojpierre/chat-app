import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import VideoCall from "@mui/icons-material/VideoCall";
import Messages from "./Messages";
import Input from "./Input";
import { useContext } from "react";
import { ChatContext } from "../Context/ChatContext";

const Container = styled.div`
  flex: 2;
`;

const ChatInfo = styled.span`
  height: 50px;
  background-color: #f7941e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: white;
  font-family: "Poppins", "serif";
`;

const ChatInfoName = styled.div``;

const ChatIcons = styled.i`
  display: flex;
  gap: 10px;
  height: 24px;
  cursor: pointer;
`;

const Chat = () => {
  const { data } = useContext(ChatContext);
  console.log("Data from ChatContext:", data);
  console.log("User Display Name:", data.user?.displayName);

  // Check if data.user exists and has the displayName property
  const displayName = data.user?.displayName || "Loading...";

  return (
    <Container>
      <ChatInfo>
        <ChatInfoName>{data.selectedUser?.displayName}</ChatInfoName>
        <ChatIcons>
          <VideoCall />
          <AddIcon />
          <MoreHoriz />
        </ChatIcons>
      </ChatInfo>
      <Messages />
      <Input />
    </Container>
  );
};

export default Chat;
