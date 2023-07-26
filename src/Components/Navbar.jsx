import { useContext, useState } from "react";
import styled from "styled-components";
import image1 from "../Images/image1.jpg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../Context/AuthContext";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9d8b8;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: #f7941e;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserTitle = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
  font-family: "Poppins", sans-serif;
  padding: 10px;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f7941e;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e27c12;
  }
`;

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const [user] = useState({
    name: "Peter",
    imageSrc: image1,
  });

  const handleLogout = () => {
    // Handle logout logic here
  };

  return (
    <Container>
      <Logo>Pie Chat</Logo>
      <User>
        <UserImg src={currentUser.photoURL} alt="" />
        <UserTitle>{currentUser.displayName}</UserTitle>
        <LogoutButton onClick={() => signOut(auth)}>Logout</LogoutButton>
      </User>
    </Container>
  );
};

export default Navbar;
