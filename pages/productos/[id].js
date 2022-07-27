import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import FirebaseContext from '@firebase/context';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';


const ContenedorProducto = styled.div`
    @media (min-width: 778px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #DA552F;
  color: #FFF;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {

    // State del componente
    const [error, guardarError] = useState(false);
    const [producto, guardarProducto] = useState({});
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // Context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if( id && consultarDB ) {
            const obtenerProducto = async () => {
                // const productoQuery = await firebase.db.collection("productos").doc(id);
                const producto = await firebase.getProduct(id);

                if( producto.exists ){
                    guardarProducto(producto.data());
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if( Object.keys(producto).length === 0 && !error ) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    // Administrar y validar votos
    const votarProducto = () => {
      if( !usuario ) {
        return router.push("/login");
      }

      // Verificar si el usuario actual voto
      if( haVotado.includes(usuario.uid) ) return;

      // Guardar el id del usuario que voto
      const nuevoHaVotado = [...haVotado, usuario.uid];

      // Obtener y sumar un nuevo voto
      const nuevoTotal = votos + 1;

      // Actualizar DB
      firebase.db.collection("productos").doc(id).update({ 
        votos: nuevoTotal, 
        haVotado: nuevoHaVotado 
      });

      // Actualizar el state
      guardarProducto({
        ...producto,
        votos: nuevoTotal
      });

      guardarConsultarDB(true);
    };

    // Funciones para crear comentarios
    const comentarioChange = e => {
      guardarComentario({
        ...comentario,
        [e.target.name]: e.target.value
      });
    }; 

    // Identifica si el comentario es del creador del prod
    const esCreador = id => {
      if( creador.id === id ) {
        return true;
      }
    };

    const agregarComentario = e => {
      e.preventDefault();

      if( !usuario ) {
        return router.push("/login");
      }

      // Info extra al comentario
      comentario.usuarioId = usuario.uid;
      comentario.usuarioNombre = usuario.displayName;

      // Tomar copia de comentario y agregar al array
      const nuevosComentarios = [...comentarios, comentario];

      // Actializar DB
      firebase.db.collection("productos").doc(id).update({ 
        comentarios: nuevosComentarios
      });

      // Actualizar state
      guardarProducto({
        ...producto,
        comentarios: nuevosComentarios
      });

      guardarConsultarDB(true);
    };

    // Funcion que verisa que el creador del prod sea el mismo que esta auth
    const puedeBorrar = () => {
      if(!usuario) return false;
      if(creador.id === usuario.uid) return true;
    };

    // Elimina un pro de la bd
    const eliminarProducto = async () => {

      if( !usuario ) {
        return router.push("/login");
      }

      if( creador.id !== usuario.uid ) {
        return router.push("/");
      }

      try {
        await firebase.db.collection("productos").doc(id).delete();
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
            <div className="contenedor">
              <h1
                css={css`
                  text-align: center;
                  margin-top: 5rem;
                `}
              >
                {nombre}
              </h1>

              <ContenedorProducto>
                <div>
                  <p>
                    Publicado hace:{" "}
                    {formatDistanceToNow(new Date(creado), { locale: es })}
                  </p>
                  <p>
                    Por: {creador.nombre} de {empresa}
                  </p>
                  <img src={urlimagen} />
                  <p>{descripcion}</p>

                  {usuario && (
                    <>
                      <h2>Agrega tu comentario</h2>
                      <form onSubmit={agregarComentario}>
                        <Field>
                          <input
                            type="text"
                            name="mensaje"
                            onChange={comentarioChange}
                          />
                        </Field>
                        <InputSubmit type="submit" value="Agregar Comentario" />
                      </form>
                    </>
                  )}

                  <h2
                    css={css`
                      margin: 2rem 0;
                    `}
                  >
                    Comentarios
                  </h2>

                  {comentarios.length === 0 ? (
                    "Aún no hay comentarios"
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
                            Escrito por:
                            <span
                              css={css`
                                font-weight: bold;
                              `}
                            >
                              {" "}
                              {comentario.usuarioNombre}
                            </span>
                          </p>
                          {esCreador(comentario.usuarioId) && (
                            <CreadorProducto>Es Creador</CreadorProducto>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <aside>
                  <Button target="_blank" bgColor="true" href={url}>
                    Visitar URL
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
                      {votos} Votos
                    </p>

                    {usuario && <Button onClick={votarProducto}>Votar</Button>}
                  </div>
                </aside>
              </ContenedorProducto>
              { puedeBorrar() && 
                <Button
                  onClick={eliminarProducto}
                >ELiminar Producto</Button>
              }
            </div>
          )}
        </>
      </Layout>
    );
};
 
export default Producto;