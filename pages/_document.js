import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="es">
            <Head>
                {/* Meta tags esenciales */}
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="description" content="Crm - Client, un Sistema de administracion para tu negocio." />
                <meta name="keywords" content="administracion, negocio, clientes, productos, gestion, tareas" />
                <meta name="author" content="Entremedias Team" />
                <meta property="og:title" content="Crm - Client" />
                <meta property="og:description" content="Crm - Client, un Sistema de administracion para tu negocio." />
                {/* <meta property="og:image" content="../../logo-entremedias.jpeg" /> */}
                <meta property="og:url" content="https://www.crm-client.com" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Crm - Client" />
                <meta name="twitter:description" content="Crm - Client, un Sistema de administracion para tu negocio." />

                
                {/* Favicon */}
                {/* <link rel="icon" href="/logo-entremedias.jpeg" type="image/x-icon" /> */}
                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />

                {/* Otros scripts o estilos */}
                <link rel="canonical" href="https://www.crm-client.com" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
