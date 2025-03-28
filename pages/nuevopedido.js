import Layout from "@/components/Layout";
import React, { useContext, useEffect, useState } from "react";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
// Context de pedido
import PedidoContext from "../context/pedidos/PedidoContex";
import ResumenPedido from "@/components/pedidos/ResumenPedido";
import Total from "@/components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import swal from 'sweetalert';


const NUEVO_PEDIDO = gql`
mutation nuevoPedido($input: PedidoInput) {
  nuevoPedido(input: $input) {
    id 
    pedido {
      cantidad
    }
    cliente {
      nombre
    }
    vendedor
    estado
  }
}
`;


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


const NuevoPedido = () => {
    
    const router = useRouter();
    const [mensaje, setMensaje] = useState(null);

    // Utilizar context y extraer sus funciones y valores
    const pedidoContex = useContext(PedidoContext);
    const {cliente, productos, total} = pedidoContex; 
    // Mutation para nuevo pedido
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO,{
        update(cache, {data: {nuevoPedido }}) {
          // Obtener el objeto de cache que deseamos actualizar
            const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS });
          // Reescribir el cache ( el cache nunca se debe modificar )
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor : [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
})

    const validarPedido = () => {
        return (!Array.isArray(productos) || !productos.every(producto => producto.cantidad > 0) 
        || total === 0 
        || !cliente || (Array.isArray(cliente) && cliente.length === 0)) 
        ? "opacity-50 cursor-not-allowed" 
        : "";
        }

        const crearNuevoPedido = async () => {
            const id = Array.isArray(cliente) ? cliente[0]?.id : cliente.id;
            if (!id) {
                console.error("El cliente no tiene un ID válido.");
                return;
            }
        
            // Remover lo no deseado de producto
            const pedido = productos.map(({ stock, __typename, nuevoObjeto, ...producto }) => producto);
                
            try {
                const { data } = await nuevoPedido({
                    variables: {
                        input: {
                            cliente: id,
                            total,
                            pedido
                        }
                    }
                });
        
                swal('Correcto', 'El Pedido se registró correctamente', { icon: "success" });
        
                router.push('/pedidos');
        
            } catch (error) {
                console.error("Error al crear el pedido:", error);
                setMensaje(error.message);
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
            }
        };
        

        const mostrarMensaje = () => {
            return (
            <div className=' flex items-center mt-5 justify-between bg-gray-300 mt-10 my-2 border-l-4 border-red-500 text-red-600 p-2 text-sm font-bold w-full max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div> 
        )
        }   

    return (
        <Layout>

            <h1 className="text-2xl text-gray-800 font-ligth">Crear Nuevo Pedido</h1>

            {mensaje && mostrarMensaje() }


            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido />
                    <Total />

                    <button
                        type="button"
                        onClick={crearNuevoPedido}
                        className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()} `}
                    >Registrar Pedido</button>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoPedido;