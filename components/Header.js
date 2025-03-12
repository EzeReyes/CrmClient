import React, {useState} from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';



const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
        id
        email
        nombre
        apellido
    }
}
`;

const Header = () => {

    const router = useRouter();

    const [mensaje, setMensaje] = useState(null);

    const { data, loading, error } = useQuery(OBTENER_USUARIO);

    if(loading) return 'Cargando.....';

    if (!data || !data.obtenerUsuario) {
        router.push("/login");
    } 

    const cerrarSesion = async () => {
            localStorage.clear();
            setMensaje('Cerrando Sesión...')
            setTimeout(() => {
                router.push('/login');
            }, 1000); 
    }

    const mostrarMensaje = () => {
        return (
        <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
            <p>{mensaje}</p>
        </div> 
    )
    }   

    return (
        <>

{mensaje && mostrarMensaje() }

        <div className='sm:flex sm:justify-between mb-6'>
            { data?.obtenerUsuario ? ( <p className='mr-2 mb-5 md:mb-0'>Hola: {data.obtenerUsuario.nombre} {data.obtenerUsuario.apellido}</p>) : null}
            <button type='button' 
                onClick={() => cerrarSesion() }
                style={{textTransform:'uppercase'}}
                className='bg-blue-800 w-full sm:w-auto font-bold text-xs rounded text-white px-1 py-2 shadow-md cursor-pointer'
                >
                Cerrar Sesión
            </button>
        </div>
        </>
    )
}

export default Header;