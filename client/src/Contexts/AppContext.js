import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export default AppContext;
