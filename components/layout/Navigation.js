import Link from "next/link";
import styled from "@emotion/styled";
import React, { useContext } from "react";
import FirebaseContext from "@firebase/context";

const Nav = styled.nav`
  padding-left: 2rem;

  a {
    font-size: 1.8rem;
    margin-left: 2rem;
    color: var(--grey2);
    font-family: "PT Sans", sans-serif;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const Navigation = () => {
  const { usuario } = useContext(FirebaseContext);

  return (
    <Nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/trendings">
        <a>Trendings</a>
      </Link>
      {usuario && (
        <Link href="/nuevo-producto">
          <a>New Product</a>
        </Link>
      )}
    </Nav>
  );
};

export default Navigation;
