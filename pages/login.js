import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// Validaciones
import useValidation from '../hooks/use-validation';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
  email: "",
  password: ""
}

const Login = () => {

  const [ error, guardarError ] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } = useValidation(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = values;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push("/");
    } catch (error) {
      console.error("Hubo un error al iniciar sesión", error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <> 
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Iniciar Sesión</h1>

          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

            <Campo>
              <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  placeholder="Tu Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </Campo>

            { errors.email && <Error>{ errors.email }</Error> }

            <Campo>
              <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  placeholder="Tu Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </Campo>

            { errors.password && <Error>{ errors.password }</Error> }

            { error && <Error>{error}</Error> }

            <InputSubmit 
              type="submit"
              value="Iniciar Sesión"
            />

          </Formulario>
        </>
      </Layout>
    </div>
  );
}
 
export default Login;
