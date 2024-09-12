module.exports = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

    // Aquí añadimos las redirecciones
    async redirects() {
      return [
        {
          source: '/:path*',  // Captura todas las rutas
          has: [
            {
              type: 'host',
              value: 'tusitio.com',  // Versión sin www
            },
          ],
          destination: 'https://ibijetrent.com/:path*',  // Redirige a la versión www
          permanent: true,  // Redirección 301 (permanente)
        },
      ];
    },
};
