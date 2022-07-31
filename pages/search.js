import { useRouter } from "next/router";
import useProducts from "@hooks/use-products";
import Layout from "@components/layout/Layout";
import React, { useEffect, useState } from "react";
import ProductDetail from "@components/layout/ProductDetail";

const Search = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;

  const { products } = useProducts("created");
  const [result, saveResult] = useState([]);

  useEffect(() => {
    const search = q.toLowerCase();
    const filter = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      );
    });

    saveResult(filter);
  }, [q, products]);

  return (
    <div>
      <Layout>
        <div className="products-list">
          <div className="container">
            <ul className="bg-white">
              {result.map((product) => (
                <ProductDetail key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Search;
