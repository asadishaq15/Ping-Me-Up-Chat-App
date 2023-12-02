import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { AuthContext } from '../context/authContext';
import { onAuthStateChanged } from 'firebase/auth';

const NavBar = () => {
  const currentUser = useContext(AuthContext);
  const [user, setUser] = useState(currentUser); // Initialize user state with the current user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // This callback function will be triggered whenever the authentication state changes.
      // It's called with the currently authenticated user or null if the user signs out.
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName;
  const photoURL = user?.photoURL;

  return (
    <div className="navbar">
      <span className="logo">PingMeUp</span>
      <div className="user">
        {displayName && photoURL ? (
          <>
            <img src={photoURL} alt={displayName} />
            <span>{displayName}</span>
            <button onClick={() => signOut(auth)}>logout</button>
          </>
        ) : (
          <button onClick={() => signOut(auth)}>logout</button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
