import { css } from "@emotion/react";
import Router, { useRouter } from "next/router";
import Error404 from "../components/layout/404";
import FirebaseContext from "@firebase/context";
import Layout from "../components/layout/Layout";
import React, { useState, useContext } from "react";
import useValidation from "../hooks/use-validation";
import FileUploader from "react-firebase-file-uploader";
import validarCrearProducto from "../validacion/validarCrearProducto";
import { Form, Field, InputSubmit, Error } from "../components/ui/Form";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  // imagen: "",
  url: "",
  descripcion: "",
};

const NewProduct = () => {
  // Image states
  const [imageName, saveImageName] = useState("");
  const [uploading, saveUploading] = useState(false);
  const [progress, saveProgress] = useState(0);
  const [urlImage, saveUrlImage] = useState("");

  const [error, saveError] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } =
    useValidation(STATE_INICIAL, validarCrearProducto, createProduct);

  const { nombre, empresa, imagen, url, descripcion } = values;

  // Routing hook
  const router = useRouter();

  // Firebase CRUD operations context
  const { usuario, firebase } = useContext(FirebaseContext);

  async function createProduct() {
    if (!usuario) {
      return router.push("/login");
    }

    // Create the new product object
    const product = {
      nombre,
      empresa,
      url,
      urlimagen: urlImage,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: [],
    };

    // TODO save the product in the db
    // firebase.db.collection('productos').add(producto)

    return router.push("/");
  }

  const handleUploadStart = () => {
    saveProgress(0);
    saveUploading(true);
  };

  const handleProgress = (p) => saveProgress({ progress: p });

  const handleUploadError = (error) => {
    saveUploading(error);
    console.error(error);
  };

  const handleUploadSuccess = (name) => {
    saveProgress(100);
    saveUploading(false);
    saveImageName(name);

    firebase.storage
      .ref("productos")
      .child(name)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        saveUrlImage(url);
      });
  };

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              New Product
            </h1>

            <Form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>General Information</legend>

                <Field>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Product name"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.nombre && <Error>{errors.nombre}</Error>}

                <Field>
                  <label htmlFor="enterprise">Enterprise</label>
                  <input
                    type="text"
                    id="enterprise"
                    placeholder="Enterprise name"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.empresa && <Error>{errors.empresa}</Error>}

                <Field>
                  <label htmlFor="image">Image</label>
                  <FileUploader
                    accept="image/*"
                    id="image"
                    name="imagen"
                    randomizeFilename
                    // storageRef={firebase.storage.ref("productos")} // TODO check this line
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Field>

                <Field>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="Product URL"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.url && <Error>{errors.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>About your product</legend>

                <Field>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.descripcion && <Error>{errors.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value="Create Product" />
            </Form>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NewProduct;
