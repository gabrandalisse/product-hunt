import React from 'react';
import Layout from '../components/layout/Layout';
import DetallesProductos from '../components/layout/DetallesProducto';
import useProducts from '../hooks/use-products';

const Home = () => {

  const { products } = useProducts("creado");

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {products.map(producto => (
                <DetallesProductos 
                  key={producto.id}
                  producto={producto}
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


