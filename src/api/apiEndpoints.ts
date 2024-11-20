export const BASE_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:3008";

export const ENDPOINTS = {
    consentUrl: "/consent",
    connect: "/api/session/initiate",
};