import firebase from "@firebase/firebase";
import React, { useState, useEffect } from "react";

function useAuthentication() {
  const [authenticatedUser, saveAuthenticatedUser] = useState(null);

  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        saveAuthenticatedUser(usuario);
      } else {
        saveAuthenticatedUser(null);
      }
    });

    return () => unsuscribe();
  }, []);

  return authenticatedUser;
}

export default useAuthentication;
