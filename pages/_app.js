import App from 'next/app';
import firebase from '@firebase/firebase';
import FirebaseContext from '@firebase/context';
import useAutenticacion from '@hooks/useAutenticacion';

const MyApp = props => {
  const usuario = useAutenticacion();

  const { Component, pageProps } = props;

  return (
    <FirebaseContext.Provider
      value={{
        firebase: firebase,
        usuario
      }}
    >

      <Component {...pageProps} />
    </FirebaseContext.Provider> 
  )
}

export default MyApp;
