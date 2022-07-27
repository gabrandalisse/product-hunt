import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

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

          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

            <Campo>
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
            </Campo>

            { errors.nombre && <Error>{ errors.nombre }</Error> }

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
              value="Crear Cuenta"
            />

          </Formulario>
        </>
      </Layout>
    </div>
  );
}
 
export default CrearCuenta;
