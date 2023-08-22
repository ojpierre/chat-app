import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; // <-- Add this import
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

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
  font-family: "Urbanist", sans-serif;
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

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AvatarIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const AvatarInput = styled.input`
  margin-right: 0.5rem;
`;

const FormInputsError = styled.span`
  color: red;
  margin-top: 0.25rem;
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAvatarError("");
    setGeneralError("");

    if (!name) {
      setNameError("Name is required");
      return;
    }

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      setPasswordError("Password must be 6 or more characters");
      return;
    } else if (password === "testtest") {
      setPasswordError("Please choose a more secure password");
      return;
    }

    if (!avatar) {
      setAvatarError("Import a pic for your avatar");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await updateProfile(res.user, {
        displayName: name,
        photoURL: downloadURL,
      });

      const docRef = doc(db, "users", res.user.uid);
      await setDoc(docRef, {
        uid: res.user.uid,
        displayName: name,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
      setGeneralError("Something went wrong");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    // Process the file or save it to state as needed
  };

  return (
    <Container>
      <Wrapper>
        <Logo>PiE CHaT</Logo>
        <Title>Sign Up</Title>
        <FormInputs onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <FormInputsError>{nameError}</FormInputsError>}

          <Input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <FormInputsError>{emailError}</FormInputsError>}

          <Input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <FormInputsError>{passwordError}</FormInputsError>}

          <AvatarContainer>
            <AvatarIcon>&#128100;</AvatarIcon>
            <AvatarInput
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarError && <FormInputsError>{avatarError}</FormInputsError>}
          </AvatarContainer>
          <FormInputsButton type="submit">Sign Up</FormInputsButton>
          {generalError && <FormInputsError>{generalError}</FormInputsError>}
        </FormInputs>
        <InfoContainer>
          So You Do Have an Account? <Link to="/login">Login</Link>
        </InfoContainer>
      </Wrapper>
    </Container>
  );
};

export default Register;
