import React, { useEffect, useState } from 'react';
import { auth, storage, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  
} from 'firebase/auth';
import { provider } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

import GoogleIcon from '@mui/icons-material/Google';

const RegisterPage = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to the homepage
        navigate('/');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log("Sign In with Google success:", user);

      // Check if the user already exists in Firestore
      const userDoc = doc(db, 'users', user.uid);
      const userDocSnapshot = await userDoc.get();

      if (!userDocSnapshot.exists()) {
        // Create a new user document in Firestore
        const date = new Date().getTime();
        const storageRef = ref(storage, `${user.displayName + date}`);

        await uploadBytesResumable(storageRef, user.photoURL).then(async () => {
          const downloadURL = await getDownloadURL(storageRef);

          await setDoc(userDoc, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: downloadURL,
          });

          // Create empty user chats on Firestore
          await setDoc(doc(db, 'userChats', user.uid), {});
        });
      } else {
        console.log("User already exists in Firestore:", userDocSnapshot.data());
      }

    } catch (error) {
      setError(error.message);
    }
  };

  
  

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            // Create user on firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // Create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {});
            navigate('/');
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"> PingMeUp </span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display Name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required style={{ display: 'none' }} type="file" id="file" />
          <label htmlFor="file">
            <img src="addAvatar.png" alt="Add Avatar" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          <button
          type="button"
          onClick={handleGoogleSignUp}
          style={{
            backgroundColor: '#4285F4',
            color: '#ffffff',
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GoogleIcon style={{ marginRight: '8px' }} />
          Sign up with Google
        </button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
