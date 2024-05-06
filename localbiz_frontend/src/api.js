import axios from "axios";

const ServerUrl = "http://192.168.0.119:8000/api/v2";

// Create separate Axios instances with different base URLs
const authApi = axios.create({
  baseURL: ServerUrl,
  withCredentials: true,
});

const reviewApi = axios.create({
  baseURL: ServerUrl,
  withCredentials: true,
});

const configAPI = axios.create({
  baseURL: ServerUrl,
  withCredentials: true,
});

const usersApi = axios.create({
  baseURL: ServerUrl,
  withCredentials: true,
});

// Define your API routes
const authRoutes = {
  login: "/admin/login-admin",
  createAdmin: "/admin/create-admin",
  // Add more authentication routes as needed
};

//Define reviewRoutes
const reviewRoutes = {
  getUserReviews: "/review/user/:userId",
  createReview: "/review",
  deleteReview: "/review/:id",
};

const usersApiRoutes = {
  getUsers: "/user",
  createUser: "/user/create-user",
  createSeller: "/user/create-seller",
  deleteUser: "/user:email",
  getUsersCount: "/user/count",
};

const configApiRoutes = {
  getAPIkey: "/config",
};

// Functions to make API requests for authentication
const authApiRequests = {
  loginAdmin: async (email, password) => {
    return await authApi.post(authRoutes.login, { email, password });
  },
  createAdmin: async (data) => {
    return await authApi.post(authRoutes.createAdmin, data);
  },
  // Add more functions for other authentication routes
};

const configApiRequests = {
  getAPIkey: async (APIkey) => {
    return await configAPI.get(configApiRoutes.getAPIkey, APIkey);
  },
};

//Functions to make API request for reviews
const reviewApiRequests = {
  getUserReviews: async (userId) => {
    return await reviewApi.get(
      reviewRoutes.getUserReviews.replace(":userId", userId)
    );
  },
  createReview: async (review) => {
    return await reviewApi.post(reviewRoutes.createReview, review);
  },
  deleteReview: async (id) => {
    return await reviewApi.delete(
      reviewRoutes.deleteReview.replace(":id", id),
      {}
    );
  },
  // Add more functions for other review routes
};

// Functions to make API requests for users
const usersApiRequests = {
  getUsers: async () => {
    return await usersApi.get(usersApiRoutes.getUsers);
  },
  createUser: async (user) => {
    return await usersApi.post(usersApiRoutes.createUser, user);
  },
  createSeller: async (seller) => {
    return await usersApi.post(usersApiRoutes.createSeller, seller);
  },
  deleteUser: async (email) => {
    return await usersApi.delete(`/user/${email}`);
  },
  getUsersCount: async () => {
    return await usersApi.get(usersApiRoutes.getUsersCount);
  },
};

export { authApiRequests, usersApiRequests, reviewApiRequests, configApiRequests };
