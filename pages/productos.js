import React from 'react';
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import Producto from '../components/Producto';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            nombre
            id
            stock
            precio
        }
    }
`;

const Productos = () => {

    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    if (loading) return 'Cargando ...';
    
    return (
        <Layout>

            <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

            <Link href="/nuevoproducto" className="text-2xl text-gray-800 font-ligth">
                Nuevo Producto
            </Link>

            <div className="overflow-x-scroll">
                  <table className="sm:table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                      <tr className="text-white">
                        <th className="w-1/5 py-2">Nombre</th>
                        <th className="w-1/5 py-2">Precio</th>
                        <th className="w-1/5 py-2">Stock</th>
                        <th className="w-1/5 py-2">Eliminar</th>
                        <th className="w-1/5 py-2">Editar</th>
                      </tr>
                    </thead>
            
                    <tbody className="bg-white">
                      {data.obtenerProductos.map(producto => (
                        <Producto 
                          key={producto.id}
                          producto={producto}
                          />
                      ))}
                    </tbody>
                  </table>
            </div>  
        </Layout>
    )
}

export default Productos;