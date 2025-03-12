import React, { useEffect, useState } from "react";
import {gql, useMutation} from '@apollo/client';
import swal from 'sweetalert';


const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!,$input: PedidoInput) {
        actualizarPedido( id: $id, input: $input) {
            estado 
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
mutation eliminarPedido($id: ID!) {
  eliminarPedido(id: $id) 
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

const Pedido = ({pedido}) => {

    const { id, total, cliente:{nombre, apellido, email, telefono}, estado, cliente } = pedido;

    // Mutation para cambia el estado de un pedido
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO,{
            update(cache, {data: {eliminarPedido }}) {
              // Obtener el objeto de cache que deseamos actualizar
                const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS });
              // Reescribir el cache ( el cache nunca se debe modificar )
                cache.writeQuery({
                    query: OBTENER_PEDIDOS,
                    data: {
                        obtenerPedidosVendedor : obtenerPedidosVendedor.filter( pedidoActual => pedidoActual.id !== id)
                    }
                })
            }
    })

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if(estadoPedido) {
            clasePedido()
        }
    }, [estadoPedido]);

    // Modifica el color del pedido de acuerdo a su estado
    const clasePedido = () => {
        if( estadoPedido === "PENDIENTE" ) {
            setClase('border-yellow-500')
        } else if(estadoPedido === "COMPLETADO") {
            setClase("border-green-500")
        } else {
            setClase("border-red-500")
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente: cliente.id
                    }
                }
            });
            setEstadoPedido(data.actualizarPedido.estado)
        } catch (error) {
            console.log(error)
        }
    }

    // Eliminar un cliente
        const confirmarEliminarPedido = () => {
            swal({
                title: "Deseas eliminar este pedido?",
                text: "Está acción no se puede deshacer",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ["No, cancelar", "Si Eliminar"]
              })
              .then ( async (willDelete) => {
                if (willDelete) {
                    const { data } = await eliminarPedido({
                      variables: {
                        id
                      }
                    })
                  swal(data.eliminarPedido, {
                    icon: "success",
                  });
                }
              });
        }

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow`}>
            <div>
                <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>

                {email && (
                    <p className="flex items-center my-2 p-2">
                        <svg dataSlot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"></path>
                        </svg>
                        {email}
                    </p>
                )}

                {telefono && (
                    <p className="flex items-center my-2 p-2">
                        <svg dataSlot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"></path>
                        </svg>
                        {telefono}
                    </p>
                )}
                
                <h2 className="text-gray-800 mt-10">Estado: </h2>

                <select 
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 rounded leading-tight focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold "
                    value={estadoPedido}
                    onChange={e => cambiarEstadoPedido(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            
            <div>
                <h2 className="text-gray-800 font-bold mt-2 ">Resumen del Pedido:</h2>
                {pedido.pedido.map(articulo => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold">
                    Total a pagar:
                    <span className="font-ligth">$ {total}</span>
                </p>

                <button
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading tight uppercase text-xs font-bold"
                    onClick={() => confirmarEliminarPedido() }
                >
                    Eliminar Pedido
                    <svg dataSlot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-4 h-4 ml-2'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </button>
            </div>

        </div>
    )
}

export default Pedido;

