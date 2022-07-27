import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import ProductDetail from '../components/layout/ProductDetail';
import useProducts from '../hooks/use-products';

const Buscar = () => {

  const router = useRouter();
  const { query: { q } } = router; // Extraer query de la url

  const { productos } = useProducts("creado");
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter( producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      )
    })
    guardarResultado(filtro);
  },[q, productos]);

  return (
    <div>
       <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {resultado.map(producto => (
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
 
export default Buscar;
