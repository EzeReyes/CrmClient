import Layout from '@/components/Layout';
import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Formik } from 'formik';

const OBTENER_PRODUCTO = gql`
query obtenerProducto ($id: ID!) {
    obtenerProducto(id: $id) {
        nombre
        stock
        precio
    }
}
`;

const ACTUALIZAR_PRODUCTO =  gql`
mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      nombre
      id
    }
  }
`;

const EditarProducto = () => {

    const router = useRouter();
    const { query: {id} } = router;
    console.log(id)
    
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO)

    
    if(loading) return "Cargando ..."
    const {obtenerProducto} = data;

    // console.log(data)
    // console.log(loading)
    // console.log(error)




    const schemaValidation = Yup.object({
            nombre: Yup.string()
                        .required('El nombre del producto es requerido'),
            stock: Yup.number()
            .required('El stock del producto es obligatorio'),
            precio: Yup.number()
                        .required('El precio del producto es obligatorio')
    })
    
        // Modificar el cliente en la base de datos
        const editarProducto = async valores => {
            const { nombre, stock, precio} = valores;
    
            try {
                const {data} = await actualizarProducto({
                    variables: {
                        id,
                        input: {
                            nombre,
                            stock,
                            precio
                        }
                    }
            })
            console.log(data)
            // TODO: Sweet alert
    
            swal('Actualizado',
                'El Producto se actualizó correctamente', {
                icon: "success"}
            )
    
            // TODO: REDIRECCIONAR USUARIO
            router.push('/productos');
            } catch (error) {
                console.log(error);
            }
            }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

                    <div className='flex justify-content mt-5'>
                        <div className='w-full max-w-lg'>

                            <Formik
                                    validationSchema={schemaValidation}
                                    enableReinitialize
                                    initialValues={obtenerProducto}
                                    onSubmit={ editarProducto }                    
                            >

                                {props => {
                                    console.log(props);
                                return (

                                    <form 
                                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                        onSubmit={props.handleSubmit}
                                    >

                                        <div className='mb-4'>
                                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                                Nombre
                                            </label>

                                            <input 
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                                id="nombre"
                                                type='text'
                                                placeholder='Nombre Producto'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.nombre}
                                            />
                                        </div>

                                        {props.touched.nombre && props.errors.nombre ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                        ): null }

                                        <div className='mb-4'>
                                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='stock'>
                                                Stock
                                            </label>

                                            <input 
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                                id="stock"
                                                type='number'
                                                placeholder='Stock'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.stock}
                                            />
                                        </div>

                                        {props.touched.stock && props.errors.stock ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.stock}</p>
                                            </div>
                                        ): null }

                                        <div className='mb-4'>
                                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                                                Precio
                                            </label>

                                            <input 
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                                id="precio"
                                                type='number'
                                                placeholder='Precio'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.precio}
                                            />
                                        </div>

                                        {props.touched.precio && props.errors.precio ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.precio}</p>
                                            </div>
                                        ): null }

                                        
                                        <input
                                            type="submit"
                                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                            value="Editar Cliente"
                                        />

                                    </form>

                                    )
                                }}

                            </Formik>
                        </div>
                    </div>            

        </Layout>
    )
}

export default EditarProducto;