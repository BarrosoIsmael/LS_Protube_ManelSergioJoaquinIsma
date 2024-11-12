export const getEnv = () => {
  const { VITE_API_DOMAIN, VITE_MEDIA_DOMAIN, ...otherViteConfig } = import.meta.env;

  return {
    API_BASE_URL: `${VITE_API_DOMAIN}/api`,
    FRONT_BASE_URL: `${VITE_MEDIA_DOMAIN}`,
    __vite__: otherViteConfig
  };
};

