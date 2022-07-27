import React from 'react';
import Layout from '../components/layout/Layout';
import ProductDetail from '../components/layout/ProductDetail';
import useProducts from '../hooks/use-products';

const Populares = () => {

  const { products } = useProducts("votos");

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {products.map(producto => (
                <ProductDetail 
                  key={producto.id}
                  product={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
 
export default Populares;