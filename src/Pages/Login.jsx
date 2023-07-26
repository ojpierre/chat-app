import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Container = styled.div`
  background-color: #f9d8b8;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  animation: ${fadeIn} 0.5s ease;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  color: #f7941e;
  margin-bottom: 1rem;
  font-family: "Montserrat", sans-serif;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
`;

const FormInputs = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  font-family: "Poppins", sans-serif;
`;

const FormInputsButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #f7941e;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e27c12;
  }
`;

const InfoContainer = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #777;
  font-family: "Urbanist", sans-serif;
`;

const FormInputsError = styled.span``;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.log("Login error:", err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setErr("Invalid email or password.");
      } else {
        setErr("Something went wrong.");
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <Logo>PiE CHaT</Logo>
        <Title>Login</Title>
        <FormInputs onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormInputsButton type="submit">Login</FormInputsButton>
        </FormInputs>
        <InfoContainer>
          Don't have an account? <Link to="/register">Sign up</Link>
        </InfoContainer>
        {err && <FormInputsError>Something went wrong</FormInputsError>}
      </Wrapper>
    </Container>
  );
};

export default Login;
