import React from "react";
import { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client';
import PedidoContext from "../../context/pedidos/PedidoContex";

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

const AsignarCliente = () => {


    const [cliente, setCliente] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
        const { agregarElCliente } = pedidoContext;
    // Consulta la base de datos de clientes
    const {data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarElCliente(cliente)
    }, [cliente]);
    
    const seleccionarCliente = cliente => {
        setCliente(cliente);
    }

// Resultados de la consulta
if (loading) return null;

const {obtenerClientesVendedor} = data

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">Asigna un cliente al pedido</p>
                <Select 
                className="mt-3"
                options={obtenerClientesVendedor}
                isMulti={true}
                onChange={ opcion => seleccionarCliente (opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => opciones.nombre}
                placeholder='Seleccione el Cliente'
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    )
}

export default AsignarCliente;