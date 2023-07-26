import { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import image1 from "../Images/image1.jpg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #fef0e7;
  border-bottom: 1px solid gray;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SearchContainer = styled.div`
  animation: ${fadeIn} 0.5s ease;
`;

const SearchContainerItems = styled.form`
  padding: 10px;
  display: flex;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  margin-right: 1rem;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

const SearchButton = styled.button`
  padding: 10px;
  background-color: #f7941e;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e27c12;
  }
`;

const UserChat = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  color: #ffffff;
  cursor: pointer;
  background-color: #fef0e7;
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

const UserChatInfo = styled.div``;

const UserChatName = styled.span`
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
`;

const SearchError = styled.span``;

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    console.log("handleSearch called");
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      e.preventDefault(); // Prevent default behavior when "Enter" is pressed.
      handleSearch(); // Perform the search.
    }
  };

  const handleSelect = async () => {
    dispatch({ type: "SELECT_USER", payload: user });
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <Container>
      <SearchContainer>
        <SearchContainerItems>
          <SearchInput
            type="text"
            placeholder="Find a user"
            onKeyDown={handleKey} // Handle "Enter" key press.
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <SearchButton>Search</SearchButton>
        </SearchContainerItems>
      </SearchContainer>
      {err && <SearchError>User not found!</SearchError>}
      {user && (
        <UserChat onClick={handleSelect}>
          <UserChatImg src={user.photoURL} alt="" />
          <UserChatInfo>
            <UserChatName>{user.displayName}</UserChatName>
          </UserChatInfo>
        </UserChat>
      )}
    </Container>
  );
};

export default Search;
