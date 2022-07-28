import Router from "next/router";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import React, { useState } from "react";

const InputText = styled.input`
  border: 1px solid var(--grey3);
  padding: 1rem;
  min-width: 300px;
`;

const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/search.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;

  &:hover {
    cursor: pointer;
  }
`;

const Search = () => {
  const [search, saveSearch] = useState("");

  const searchProduct = (e) => {
    e.preventDefault();

    if (search.trim() === "") return;

    Router.push({
      pathname: "/search",
      query: { q: search },
    });
  };

  return (
    <form
      css={css`
        position: relative;
      `}
      onSubmit={searchProduct}
    >
      <InputText
        type="text"
        placeholder="Search Products"
        onChange={(e) => saveSearch(e.target.value)}
      />
      <InputSubmit type="submit">Search Product Hunt</InputSubmit>
    </form>
  );
};

export default Search;
