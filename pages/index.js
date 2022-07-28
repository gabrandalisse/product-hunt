import React from 'react';
import useProducts from '../hooks/use-products';
import Layout from '../components/layout/Layout';
import ProductDetail from '../components/layout/ProductDetail';

const Home = () => {
  const { products } = useProducts("creado");

  // TODO rename css classes
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {products.map(product => (
                <ProductDetail 
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
 
export default Home;


