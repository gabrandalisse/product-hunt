import App from "next/app";
import firebase from "@firebase/firebase";
import FirebaseContext from "@firebase/context";
import useAuthentication from "@hooks/use-authentication";

const MyApp = (props) => {
  const user = useAuthentication();

  const { Component, pageProps } = props;

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        user,
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
