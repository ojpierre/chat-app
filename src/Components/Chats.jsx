import { styled } from "styled-components";
import image1 from "../Images/image1.jpg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../Context/ChatContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #f7941e;
`;

const UserChat = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
  color: #ffffff;
  cursor: pointer;
  background-color: #f7941e;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2f2d52;
  }
`;

const UserChatImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserChatInfo = styled.p`
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
`;

const UserChatInfoName = styled.span`
  font-size: 14px;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
`;

const UserChatInfoMsg = styled.p`
  font-size: 10px;
  color: lightgray;
  font-family: "Poppins", sans-serif;
`;

// Apply media query for responsive styling
const ResponsiveUserChat = styled(UserChat)`
  @media (max-width: 768px) {
    padding: 8px;
    gap: 8px;
    margin-top: 2px;
    margin-bottom: 2px;
  }
`;

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        // Check if doc.data() is not undefined before updating the state
        if (doc.exists()) {
          setChats(doc.data());
        } else {
          // Handle the case when the document doesn't exist
          setChats([]); // Set chats to an empty array to avoid further errors
        }
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <Container>
      {chats &&
        Object.entries(chats).map((chat) => (
          <>
            <ResponsiveUserChat
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            ></ResponsiveUserChat>
            <UserChat key={chat[0]} onClick={handleSelect(chat[1].userInfo)}>
              <UserChatImg src={chat[1].userInfo.photoURL} alt="User" />
              <UserChatInfo>
                <UserChatInfoName>
                  {chat[1].userInfo.displayName}
                </UserChatInfoName>
                <UserChatInfoMsg>{chat[1].lastMessage?.text}</UserChatInfoMsg>
              </UserChatInfo>
            </UserChat>
          </>
        ))}
    </Container>
  );
};

export default Chats;
