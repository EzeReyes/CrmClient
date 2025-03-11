import Layout from "@/components/Layout";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'; 


const NUEVO_PRODUCTO = gql`
mutation nuevoProducto($input: ProductoInput) {
  nuevoProducto(input: $input){
    id
    nombre
    stock
    precio
    creado
  }
}
`;

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


const NuevoProducto = () => {

    const router = useRouter();
    const [mensaje, setMensaje] = useState(null);
    // Formulario para nuevo producto

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: {nuevoProducto}}) {
            // obtener el objeto del cache
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS});
        
            // Reescribir ese objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            stock: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre es obligatorio'),
            stock: Yup.number()
                        .required('El stock es obligatorio')
                        .positive('No se aceptan valores negativos')
                        .integer('El stock deben ser números enteros'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan valores negativos')
        }), 
        onSubmit : async valores => {   
            const { nombre, stock, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            stock,
                            precio
                        }
                    }
                });
                setMensaje(`Producto ${data.nuevoProducto.nombre}, creado con éxito`);
                setTimeout(() => {
                    setMensaje(null);
                    router.push('/productos');
                }, 3000);
            } catch (error) {
                setMensaje(error.message.replace('GraphQL error:', ''));
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
            }
        }
    })

    const mostrarMensaje = () => {
        return (
        <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
            <p>{mensaje}</p>
        </div> 
    )
    }    


    return (
        <Layout>

            {mensaje && mostrarMensaje() }


            <h1 className="text-2xl text-gray-800 font-ligth">Crear Nuevo Producto</h1>

            <div className='flex justify-content mt-5'>
                <div className='w-full max-w-lg'>
                    <form 
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                            </div>

                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.nombre}</p>
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
                                    placeholder='Stock Disponible'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.stock}
                                />
                            </div>

                            {formik.touched.stock && formik.errors.stock ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.stock}</p>
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                />
                            </div>

                            {formik.touched.precio && formik.errors.precio ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ): null }


                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Agregar Nuevo Producto"
                            />
                    </form>
                </div>
            </div>    
        </Layout>
    )
}

export default NuevoProducto;