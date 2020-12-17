import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  socket: null,
});

export default AppContext;
