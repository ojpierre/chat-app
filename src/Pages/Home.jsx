import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../Components/Sidebar.jsx";
import Chat from "../Components/Chat.jsx";

const Container = styled.div`
  display: flex;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9d8b8;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const HomeContainer = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  width: 65%;
  height: 80%;
  display: flex;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    width: 90%;
    height: auto;
    flex-direction: column;
  }
`;

const Home = () => {
  return (
    <Container>
      <HomeContainer>
        <Sidebar />
        <Chat />
      </HomeContainer>
    </Container>
  );
};

export default Home;
