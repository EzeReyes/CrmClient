import React from 'react';
import Layout from '@/components/Layout';
import Pedido from '@/components/Pedido';
import Link from 'next/link';
import {gql, useQuery} from '@apollo/client';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
        id
        pedido {
            id 
            cantidad
            nombre
        }
        cliente {
            nombre
            id
            email
            apellido
            telefono
            }
        vendedor
        total
        estado
        }
    }
`;

const Pedidos = () => {
    const {data, loading,error} = useQuery(OBTENER_PEDIDOS);


    if(loading) return "Cargando...";

    const { obtenerPedidosVendedor} = data;

    console.log(obtenerPedidosVendedor)
    

    return (
        <Layout>
            <h1 class="text-2xl text-gray-800 font-light">Pedidos</h1>

            <Link href="/nuevopedido" 
                className="py-2 px-5 mt-3 inline-block text-black bg-black-500 rounded text-sm hover:bg-gray-800 mb-3 font-bold uppercase">
                Nuevo Pedido
            </Link>

            { obtenerPedidosVendedor.length === 0 ? (
                <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
            ) : (
                obtenerPedidosVendedor.map(pedido => (
                    <Pedido 
                        key={pedido.id}
                        pedido={pedido}
                    />
                ))
            )}

        </Layout>
    )
}

export default Pedidos;