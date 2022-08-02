import FirebaseContext from "@firebase/context";
import React, { useState, useEffect, useContext } from "react";

const useProducts = (order) => {
  const [products, saveProducts] = useState([]);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const getProducts = async () => {
      await firebase.getProducts(handleSnapshot, order);
    };

    getProducts();
  }, []);

  function handleSnapshot(snapshot) {
    const products = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    saveProducts(products);
  }

  return {
    products,
  };
};

export default useProducts;
