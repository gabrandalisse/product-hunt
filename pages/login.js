import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';

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

          <Form
            onSubmit={handleSubmit}
            noValidate
          >

            <Field>
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
            </Field>

            { errors.email && <Error>{ errors.email }</Error> }

            <Field>
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
            </Field>

            { errors.password && <Error>{ errors.password }</Error> }

            { error && <Error>{error}</Error> }

            <InputSubmit 
              type="submit"
              value="Iniciar Sesión"
            />

          </Form>
        </>
      </Layout>
    </div>
  );
}
 
export default Login;
