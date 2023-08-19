import styled from "styled-components";
import Navbar from "../Components/Navbar.jsx";
import Search from "../Components/Search.jsx";
import Chats from "../Components/Chats.jsx";

const Container = styled.div`
  flex: 1;
  background-color: #f7941e;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Sidebar = () => {
  return (
    <Container>
      <Navbar />
      <Search />
      <Chats />
    </Container>
  );
};

export default Sidebar;
