import styled from "styled-components";
import Attach from "@mui/icons-material/AttachFileSharp";
import AttachImg from "@mui/icons-material/ImageOutlined";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Container = styled.div`
  height: 50px;
  background-color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputContainer = styled.input`
  width: 100%;
  border: none;
  outline: none;
  color: #f7941e;
  font-size: 14px;
  &::placeholder {
    color: lightgray;
  }
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  color: #f7941e;
  font-size: 14px;
  &::placeholder {
    color: lightgray;
  }
`;

const SendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AttachImgIcon = styled.i``;

const SendFileInput = styled.input``;

const SendLabel = styled.label``;

const AttachIcon = styled.i``;

const SendButton = styled.button`
  border: none;
  padding: 10px 15px;
  color: white;
  background-color: #f7941e;
`;

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log("Data from ChatContext:", data);

  const handleSend = async () => {
    if (!data || !data.chatId) {
      console.error("Chat data is not available");
      return;
    }

    if (!currentUser || !currentUser.uid) {
      console.error("User data is not available");
      return;
    }

    if (!text) {
      console.error("Text is empty");
      return;
    }

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                      id: uuid(),
                      text,
                      senderId: currentUser.uid,
                      date: Timestamp.now(),
                      img: downloadURL,
                    }),
                  });
                  resolve();
                }
              );
            }
          );
        });
      } catch (error) {
        // Handle error during image upload
        console.error("Error during image upload:", error);
        return;
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    try {
      await Promise.all([
        updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        }),
        updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        }),
      ]);
    } catch (error) {
      console.error("Error updating userChats:", error);
    }

    setText("");
    setImg(null);
  };

  return (
    <Container>
      <TextInput
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <SendContainer>
        <AttachImgIcon>
          <AttachImg />
        </AttachImgIcon>
        <SendFileInput
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />{" "}
        <SendLabel htmlFor="file">
          <AttachIcon>
            <Attach />
          </AttachIcon>
        </SendLabel>
        <SendButton onClick={handleSend}>Send</SendButton>
      </SendContainer>
    </Container>
  );
};

export default Input;
