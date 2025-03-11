import React, {useEffect, useState, useContext} from "react";
import Select from 'react-select';
import { gql, useQuery} from '@apollo/client';
import PedidoContext from "../../context/pedidos/PedidoContex";


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

const AsignarProductos = () => {

    // state local del componente
    const [ productos, setProductos ] = useState([]);
    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;


    // cONSULTA A LA BASE DE DATOS
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        agregarProducto(productos);
    }, [productos])

    // console.log(data);
    // console.log(error);

    const seleccionarProducto = producto => {
        setProductos(producto)
    }

    if (loading) return null;
    const { obtenerProductos } = data;
 
    return (
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona o busca los productos</p>
            <Select 
            className="mt-3"
            options={obtenerProductos}
            isMulti={true}
            onChange={ opcion => seleccionarProducto (opcion)}
            getOptionValue={opciones => opciones.id}
            getOptionLabel={opciones => `${opciones.nombre} - ${opciones.stock} Disponibles`}
            placeholder='Seleccione el Productos'
            noOptionsMessage={() => 'No hay resultados'}
        />
    </>
    )
}

export default AsignarProductos;