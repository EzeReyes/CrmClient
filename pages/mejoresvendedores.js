import Layout from '@/components/Layout';
import React, {useEffect} from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const MEJORES_VENDEDORES = gql`
query mejoresVendedores {
  mejoresVendedores {
    vendedor {
      apellido
      nombre
      id
    }
    total
  }
}
`;


const MejoresVendedores = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);

    useEffect(() => {
        startPolling(1000);
        return() => {
            stopPolling();
        }
    }, [startPolling, stopPolling])


    if (loading) return "Cargando..."
    const {mejoresVendedores} = data;

    console.log(mejoresVendedores)

    const vendedorGrafica = [];

    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    })

    console.log(vendedorGrafica);

    return (

        <Layout>
            <h1 class="text-2xl text-gray-800 font-light">Mejores Vendedores</h1>
                <ResponsiveContainer
                    width={'99%'}
                    height={550}
                >
                    <BarChart
                        width={600}
                        height={500}
                        data={vendedorGrafica}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#3182CE" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>
        </Layout>
    )
}

export default MejoresVendedores;