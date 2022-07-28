import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React, { useEffect, useContext, useState } from "react";

// Components
import Button from "../../components/ui/Button";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { Field, InputSubmit } from "../../components/ui/Form";

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
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = product;

  /**
   * Validate and manage votes
   */
  const voteProduct = () => {
    if (!user) {
      return router.push("/login");
    }

    // Check if the actual user already have voted
    if (haVotado.includes(user.uid)) return;

    // Save the id of the user who voted
    const newHaveVoted = [...haVotado, user.uid];

    // Get and sum the votes
    const newTotal = votos + 1;

    // Update the db collection // TODO refactor this function
    // firebase.db.collection("productos").doc(id).update({
    //   votos: newTotal,
    //   haVotado: newHaveVoted
    // });

    // Update the component state
    saveProduct({
      ...product,
      votos: newTotal,
    });

    saveDBQuery(true);
  };

  /**
   * Create a new comment
   * @param {*} e The change event information
   */
  const commentChange = (e) => {
    saveComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Checks if the comments belongs to the post owner
   * @param {*} id The id of the current user
   * @returns {true} If the actual user is the post owner
   */
  const isOwner = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  /**
   * Add a new comment
   * @param {*} e The submit event data
   */
  const addComment = (e) => {
    e.preventDefault();

    if (!user) {
      return router.push("/login");
    }

    // Add extra information to the comment
    comment.usuarioId = user.uid;
    comment.usuarioNombre = user.displayName;

    // Create a copy of the comment and push it to the array
    const newComments = [...comentarios, comment];

    // Update DB // TODO refactor
    // firebase.db.collection("productos").doc(id).update({
    //   comentarios: newComments
    // });

    // Update state
    saveProduct({
      ...product,
      comentarios: newComments,
    });

    saveDBQuery(true);
  };

  /**
   * Check if the actual user can delete the post
   * @returns {true} If the actual user id match the post owner id
   */
  const canDelete = () => {
    if (!user) return false;
    if (creador.id === user.uid) return true;
  };

  /**
   * Delete a product
   */
  const deleteProduct = async () => {
    if (!user) {
      return router.push("/login");
    }

    if (creador.id !== user.uid) {
      return router.push("/");
    }

    try {
      // TODO refactor
      // await firebase.db.collection("productos").doc(id).delete();
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
          // TODO refactor css classes names
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>

            <ProductContainer>
              <div>
                <p>Posted {formatDistanceToNow(new Date(creado))}</p>
                <p>
                  By: {creador.nombre} from {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>

                {user && (
                  <>
                    <h2>Add a new comment</h2>
                    <form onSubmit={addComment}>
                      <Field>
                        <input
                          type="text"
                          name="mensaje"
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

                {comentarios.length === 0 ? (
                  "There are no comments yet"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Written by:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {isOwner(comentario.usuarioId) && (
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
                    {votos} Votes
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
