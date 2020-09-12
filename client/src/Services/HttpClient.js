import axios from "axios";

export default () => {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultOptions, ...options }),
  };
};
