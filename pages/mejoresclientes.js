import Layout from '@/components/Layout';
import React, {useEffect} from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const MEJORES_CLIENTES = gql`
query mejoresClientes {
  mejoresClientes {
    cliente{
      nombre
      empresa
    }
    total
  }
}
`;


const MejoresClientes = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return() => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    
    if (loading) return "Cargando..."
    const {mejoresClientes} = data;


    const clienteGrafica = [];

    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        }
    })


    return (

        <Layout>
            <h1 class="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
          <ResponsiveContainer
              width={'99%'}
              height={550}
          >
            <BarChart
              width={600}
              height={500}
              data={clienteGrafica}
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

export default MejoresClientes;