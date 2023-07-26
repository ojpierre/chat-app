import { useState } from "react";
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

const FormInputsError = styled.span``;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a reference to the storage location
      const storageRef = ref(storage, displayName);

      // Uploading the image and waiting for it to complete
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      // Getting the download URL after the upload is complete
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // Updating the user profile with the display name and photo URL
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      // Writing user data to Firestore using 'setDoc'
      console.log("Before setDoc");
      const docRef = doc(db, "users", res.user.uid);
      await setDoc(docRef, {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });
      console.log("After setDoc");
      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
      setErr(true);
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
          <AvatarContainer>
            <AvatarIcon>&#128100;</AvatarIcon>
            <AvatarInput
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </AvatarContainer>
          <FormInputsButton type="submit">Sign Up</FormInputsButton>
          {err && <FormInputsError>Something went wrong</FormInputsError>}
        </FormInputs>
        <InfoContainer>
          So You Do Have an Account? <Link to="/login">Login</Link>
        </InfoContainer>
      </Wrapper>
    </Container>
  );
};

export default Register;
