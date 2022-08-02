import Router from "next/router";
import { css } from "@emotion/react";
import React, { useState } from "react";
import firebase from "@firebase/firebase";
import Layout from "@components/layout/Layout";
import useValidation from "@hooks/use-validation";
import validateLogin from "@validations/validateLogin";
import { Form, Field, InputSubmit, Error } from "@components/ui/Form";

const INICIAL_STATE = {
  email: "reclutier@admin.com",
  password: "admin-admin",
};

const Login = () => {
  const [error, saveError] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } =
    useValidation(INICIAL_STATE, validateLogin, logIn);

  const { email, password } = values;

  async function logIn() {
    try {
      await firebase.login(email, password);
      Router.push("/");
    } catch (error) {
      console.error("An error ocurred while triying to log in", error.message);
      saveError(error.message);
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
          >
            Log In
          </h1>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {errors.email && <Error>{errors.email}</Error>}

            <Field>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Your Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {errors.password && <Error>{errors.password}</Error>}

            {error && <Error>{error}</Error>}

            <InputSubmit type="submit" value="Log In" />
          </Form>
        </>
      </Layout>
    </div>
  );
};

export default Login;
