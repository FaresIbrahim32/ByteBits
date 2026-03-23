import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (username, password, name) =>
  api.post("/auth/register", { username, password, name });

export const login = async (username, password) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  const res = await api.post("/auth/login", form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const searchRestaurants = (location) =>
  api.get(`/search/restaurants?location=${location}`);

export const getMenu = (restaurantId) =>
  api.get(`/restaurants/${restaurantId}/menu`);

export const createOrder = (orderId) =>
  api.post("/orders", { order_id: orderId });

export const addItemToOrder = (orderId, itemId) =>
  api.post(`/orders/${orderId}/items`, { item_id: itemId });

export const removeItemFromOrder = (orderId, itemId) =>
  api.delete(`/orders/${orderId}/items/${itemId}`);

export const getOrderTotal = (orderId) =>
  api.get(`/orders/${orderId}/total`);

export const getMyOrders = () => api.get("/users/me/orders");
