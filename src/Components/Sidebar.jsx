import styled from "styled-components";
import Navbar from "../Components/Navbar.jsx";
import Search from "../Components/Search.jsx";
import Chats from "../Components/Chats.jsx";

const Container = styled.div`
  flex: 1;
  background-color: #f7941e;
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
