import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React, { useEffect, useContext, useState } from "react";

// Components
import Button from "@components/ui/Button";
import Error404 from "@components/layout/404";
import Layout from "@components/layout/Layout";
import { Field, InputSubmit } from "@components/ui/Form";

// Contexts
import FirebaseContext from "@firebase/context";

const ProductContainer = styled.div`
  @media (min-width: 778px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const ProductBuilder = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Product = () => {
  const [error, saveError] = useState(false);
  const [product, saveProduct] = useState({});
  const [comment, saveComment] = useState({});
  const [dbQuery, saveDBQuery] = useState(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { firebase, user } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && dbQuery) {
      const getProduct = async () => {
        const product = await firebase.getProduct(id);

        if (product.exists) {
          saveProduct(product.data());
          saveDBQuery(false);
        } else {
          saveError(true);
          saveDBQuery(false);
        }
      };

      getProduct();
    }
  }, [id]);

  if (Object.keys(product).length === 0 && !error) return "Loading...";

  const {
    comments,
    created,
    description,
    enterprise,
    name,
    url,
    urlimage,
    votes,
    owner,
    votedBy,
  } = product;

  /**
   * Validate and manage votes
   */
  const voteProduct = async () => {
    if (!user) {
      return router.push("/login");
    }

    // Check if the actual user already have voted
    if (votedBy.includes(user.uid)) return null;

    // Save the id of the user who voted
    const newHaveVoted = [...votedBy, user.uid];

    // Get and sum the votes
    const newTotal = votes + 1;

    // Update the db collection 
    await firebase.voteProduct(id, newTotal, newHaveVoted);

    // Update the component state
    saveProduct({
      ...product,
      votes: newTotal,
    });

    saveDBQuery(true);
  };

  /**
   * Create a new comment
   * @param {object} e The change event information
   */
  const commentChange = (e) => {
    saveComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Checks if the comments belongs to the post owner
   * @param {string} id The id of the current user
   * @returns {boolean} If the actual user is the post owner
   */
  const isOwner = (id) => (owner.id === id);

  /**
   * Add a new comment
   * @param {object} e The submit event data
   */
  const addComment = (e) => {
    e.preventDefault();

    if (!user) {
      return router.push("/login");
    }

    // Add extra information to the comment
    comment.userId = user.uid;
    comment.userName = user.displayName;

    // Create a copy of the comment and push it to the array
    const newComments = [...comments, comment];

    // Update DB 
    firebase.commentProduct(id, newComments);

    // Update state
    saveProduct({
      ...product,
      comments: newComments,
    });

    saveDBQuery(true);
  };

  /**
   * Check if the actual user can delete the post
   * @returns {true} If the actual user id match the post owner id
   */
  const canDelete = () => {
    if (!user) return false;
    if (owner.id === user.uid) return true;
  };

  /**
   * Delete a product
   */
  const deleteProduct = async () => {
    if (!user) {
      return router.push("/login");
    }

    if (owner.id !== user.uid) {
      return router.push("/");
    }

    try {
      await firebase.deleteProduct(id);
      return router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="container">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {name}
            </h1>

            <ProductContainer>
              <div>
                <p>Posted {formatDistanceToNow(new Date(created))}</p>
                <p>
                  By: {owner.name} from {enterprise}
                </p>
                <img src={urlimage} />
                <p>{description}</p>

                {user && (
                  <>
                    <h2>Add a new comment</h2>
                    <form onSubmit={addComment}>
                      <Field>
                        <input
                          type="text"
                          name="message"
                          onChange={commentChange}
                        />
                      </Field>
                      <InputSubmit type="submit" value="Add Comment" />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comments
                </h2>

                {comments.length === 0 ? (
                  "There are no comments yet"
                ) : (
                  <ul>
                    {comments.map((comment, i) => (
                      <li
                        key={`${comment.userId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comment.message}</p>
                        <p>
                          Written by:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comment.userName}
                          </span>
                        </p>
                        {isOwner(comment.userId) && (
                          <ProductBuilder>Is Owner</ProductBuilder>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Button target="_blank" bgColor="true" href={url}>
                  Go to URL
                </Button>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votes} Votes
                  </p>

                  {user && <Button onClick={voteProduct}>Vote</Button>}
                </div>
              </aside>
            </ProductContainer>
            {canDelete() && (
              <Button onClick={deleteProduct}>Delete Product</Button>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Product;
