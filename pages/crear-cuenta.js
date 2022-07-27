import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';

import firebase from '@firebase/firebase';

// Validaciones
import useValidation from '../hooks/use-validation';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: ""
}

const CrearCuenta = () => {

  const [ error, guardarError ] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } = useValidation(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = values;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/");
    } catch (error) {
      console.error("Hubo un error al crear el usuario", error.message);
      guardarError(error.message);
    }
  };

  return (
    <div>
      <Layout>
        <> 
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Crear Cuenta</h1>

          <Form
            onSubmit={handleSubmit}
            noValidate
          >

            <Field>
              <label htmlFor="nombre">Nombre</label>
              <input 
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            { errors.nombre && <Error>{ errors.nombre }</Error> }

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
              value="Crear Cuenta"
            />

          </Form>
        </>
      </Layout>
    </div>
  );
}
 
export default CrearCuenta;
