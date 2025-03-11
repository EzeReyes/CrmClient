import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Cliente from "@/components/Cliente";

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
`;

const Home = ({ children }) => {
  const [mensaje, setMensaje] = useState(null);
  const router = useRouter();
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    if (error) {
      setMensaje("Debes iniciar sesión para ver los clientes.");
    }
  }, [error]);

  const handleRedirect = () => {
    router.push("/login");
  };

  if (loading) return <p className="text-center text-lg">Cargando...</p>;

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>

        <Link
          href="/nuevocliente"
          className="py-2 px-5 mt-3 inline-block text-black bg-gray-500 rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
        >
          Nuevo Cliente
        </Link>

        {mensaje && (
          <div className="flex flex-col items-center bg-red-100 text-red-700 p-4 mt-5 rounded">
            <p>{mensaje}</p>
            <button
              onClick={handleRedirect}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        <div className="overflow-x-scroll">
          <table className="sm:table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {!data || !data.obtenerClientesVendedor ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-600">
                    No hay clientes disponibles.
                  </td>
                </tr>
              ) : (
                data.obtenerClientesVendedor.map((cliente) => (
                  <Cliente key={cliente.id} cliente={cliente} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {children}
      </Layout>
    </>
  );
};

export default Home;
