import React, { useState, useEffect } from 'react';
import firebase from '@firebase/firebase';

function useAutenticacion() {
    const [ usuarioAutenticado, guardarUsuarioAutentucado ] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if( usuario ) {
                guardarUsuarioAutentucado(usuario);
            } else {
                guardarUsuarioAutentucado(null);
            }
        });
        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;