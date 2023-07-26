import React, { useContext, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import image1 from "../Images/image1.jpg";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

const Container = styled.div`
  display: flex;
  font-size: 14px;
  gap: 20px;
  margin-bottom: 20px;

  ${(props) =>
    props.isOwner &&
    css`
      flex-direction: row-reverse;
    `}
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: gray;
  font-weight: 300;
`;

const MessageInfoImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const MessageInfoDate = styled.span``;

const MessageContent = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${(props) =>
    props.isOwner &&
    css`
      align-items: flex-end;
    `}
`;

const MessageContentTxt = styled.p`
  background-color: white;
  padding: 10px 20px;
  border-radius: 0px 10px 10px 10px;
  max-width: max-content;

  ${(props) =>
    props.isOwner &&
    css`
      background-color: #f7f8fe;
      color: white;
      border-radius: 10px 0px 10px 10px;
    `}
`;

const MessageContentImg = styled.img`
  width: 50%;
`;

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isOwner = message.senderId === currentUser.uid;

  return (
    <Container isOwner={isOwner}>
      <MessageInfo>
        <MessageInfoImg
          src={isOwner ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <MessageInfoDate>just now</MessageInfoDate>
      </MessageInfo>
      <MessageContent isOwner={isOwner}>
        <MessageContentTxt>{message.text}</MessageContentTxt>
        {message.img && <MessageContentImg src={message.img} alt="" />}
      </MessageContent>
    </Container>
  );
};

export default Message;
