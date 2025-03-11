import React, { use } from 'react';
import swal from 'sweetalert';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
mutation eliminarCliente($id: ID!) {
  eliminarCliente(id: $id) 
}
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
      obtenerClientesVendedor {
        id
        nombre
        apellido
        empresa
        email
  }
}
`



const Cliente = ({cliente}) => {
  
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
      update(cache, {data: {eliminarCliente }}) {
        // Obtener el objeto de cache que deseamos actualizar
        const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });
        
        // Reescribir el cache ( el cache nunca se debe modificar )

        cache.writeQuery({
            query: OBTENER_CLIENTES_USUARIO,
            data: {
                obtenerClientesVendedor : obtenerClientesVendedor.filter( clienteActual => clienteActual.id !== id)
            }
        })
      }
    })

    const { id, nombre, apellido, empresa, email} = cliente;

    // Eliminar un cliente
    const confirmarEliminarCliente = () => {
        swal({
            title: "Deseas eliminar este cliente?",
            text: "Está acción no se puede deshacer",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: ["No, cancelar", "Si Eliminar"]
          })
          .then ( async (willDelete) => {
            if (willDelete) {
              try {
                const { data } = await eliminarCliente({
                  variables: {
                    id
                  }
                })
              swal(data.eliminarCliente, {
                icon: "success",
              });
              } catch (error) {
                swal("El cliente no ha sido eliminado");
              }
            }
          });
    }

    const editarCliente = () => {
      Router.push({
        pathname: "/editarcliente/[id]",
        query: {id}
      })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 px-4 py-2 w-full text-white rounded text-xs uppercase'
                    onClick={() => confirmarEliminarCliente() }
                >
                    Eliminar
                    <svg dataSlot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-4 h-4 ml-2'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 px-4 py-2 w-full text-white rounded text-xs uppercase'
                    onClick={() => editarCliente() }
                >
                    Editar
                    <svg dataSlot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-4 h-4 ml-2'>
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                    </svg>
                </button>
            </td>
        </tr>
    )
}

export default Cliente;