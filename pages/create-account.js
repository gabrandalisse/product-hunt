import Router from "next/router";
import { css } from "@emotion/react";
import React, { useState } from "react";
import firebase from "@firebase/firebase";
import Layout from "@components/layout/Layout";
import useValidation from "@hooks/use-validation";
import { Form, Field, InputSubmit, Error } from "@components/ui/Form";
import validateCreateAccount from "@validations/validateCreateAccount";

const STATE_INICIAL = {
  name: "",
  email: "",
  password: "",
};

const CreateAccount = () => {
  const [error, saveError] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } =
    useValidation(STATE_INICIAL, validateCreateAccount, createAccount);

  const { name, email, password } = values;

  async function createAccount() {
    try {
      await firebase.createUser(name, email, password);
      Router.push("/");
      
    } catch (error) {
      console.error(
        "An error ocurred while triying to create the user",
        error.message
      );
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
            Create Account
          </h1>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                name="name"
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {errors.name && <Error>{errors.name}</Error>}

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

            <InputSubmit type="submit" value="Create Account" />
          </Form>
        </>
      </Layout>
    </div>
  );
};

export default CreateAccount;
