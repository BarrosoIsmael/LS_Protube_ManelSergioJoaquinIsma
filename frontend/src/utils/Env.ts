export const getEnv = () => {
  if (process.env.JEST_WORKER_ID) {
    return {
      API_BASE_URL: 'http://localhost:8080/api',
      FRONT_BASE_URL: 'http://localhost:8080',
      __vite__: {}
    };
  }

  /*const { VITE_API_DOMAIN, VITE_MEDIA_DOMAIN, ...otherViteConfig } = import.meta.env;

  return {
    API_BASE_URL: `${VITE_API_DOMAIN}/api`,
    FRONT_BASE_URL: `${VITE_MEDIA_DOMAIN}`,
    __vite__: otherViteConfig
  };*/

  return {
    API_BASE_URL: 'http://localhost:8080/api',
    FRONT_BASE_URL: 'http://localhost:8080',
    __vite__: {}
  };
};
