const BACKEND_URL =
  process.env.REACT_APP_PROD_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

console.log("Environment:", process.env.REACT_APP_PROD_ENV);
console.log("Backend URL:", BACKEND_URL);

export const url = BACKEND_URL;
