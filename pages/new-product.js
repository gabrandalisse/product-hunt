import { css } from "@emotion/react";
import Router, { useRouter } from "next/router";
import FirebaseContext from "@firebase/context";
import React, { useState, useContext } from "react";
import FileUploader from "react-firebase-file-uploader";
import validateCreateProduct from "@validations/validateCreateProduct";

// Components
import Error404 from "@components/layout/404";
import Layout from "@components/layout/Layout";
import { Form, Field, InputSubmit, Error } from "@components/ui/Form";

// Hooks
import useValidation from "@hooks/use-validation";

const STATE_INICIAL = {
  name: "",
  enterprise: "",
  url: "",
  description: "",
};

const NewProduct = () => {
  // Image states
  const [imageName, saveImageName] = useState("");
  const [uploading, saveUploading] = useState(false);
  const [progress, saveProgress] = useState(0);
  const [urlImage, saveUrlImage] = useState("");

  const [error, saveError] = useState(false);

  const { values, errors, handleSubmit, handleChange, handleBlur } =
    useValidation(STATE_INICIAL, validateCreateProduct, createProduct);

  const { name, enterprise, image, url, description } = values;

  // Routing hook
  const router = useRouter();

  // Firebase CRUD operations context
  const { user, firebase } = useContext(FirebaseContext);

  async function createProduct() {
    if (!user) {
      return router.push("/login");
    }

    // Create the new product object
    const product = {
      name,
      enterprise,
      url,
      urlimage: urlImage,
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      owner: {
        id: user.uid,
        name: user.displayName,
      },
      votedBy: [],
    };

    // Save the product in the db
    firebase.createProduct(product);

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

  const handleUploadSuccess = async (name) => {
    saveProgress(100);
    saveUploading(false);
    saveImageName(name);

    const imgURL = await firebase.getImageURL(name);
    saveUrlImage(imgURL);
  };

  return (
    <div>
      <Layout>
        {!user ? (
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
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.name && <Error>{errors.name}</Error>}

                <Field>
                  <label htmlFor="enterprise">Enterprise</label>
                  <input
                    type="text"
                    id="enterprise"
                    placeholder="Enterprise name"
                    name="enterprise"
                    value={enterprise}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.enterprise && <Error>{errors.enterprise}</Error>}

                <Field>
                  <label htmlFor="image">Image</label>
                  <FileUploader
                    accept="image/*"
                    id="image"
                    name="image"
                    randomizeFilename
                    storageRef={firebase.createStorageRef()} 
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
                    name="description"
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.description && <Error>{errors.description}</Error>}
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
