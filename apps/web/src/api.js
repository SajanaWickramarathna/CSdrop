// src/api.js
import axios from "axios";

// Default to local API if env is missing to avoid hitting the React dev server
const DEFAULT_API_BASE = "http://localhost:3001/api";

export const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || DEFAULT_API_BASE,
});
