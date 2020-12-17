import React from "react";
import HttpClient from "./Services/HttpClient";
import { Switch, Route, Redirect } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import AppContext from "./Contexts/AppContext";
import Install from "./Pages/Install/Install";
import Login from "./Pages/Login/Login";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Register from "./Pages/Register/Register";
import Modal from "react-modal";
import Navbar from "./Components/Navbar/Navbar";
import DashboardGuest from "./Pages/Dashboard/DashboardGuest";
import Game from "./Pages/Game/Game";
import io from "socket.io-client";

Modal.setAppElement("#root");

function App() {
  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");
    if (data.user) {
      setUser(data.user);
      setSocket(io());
    }
    setInstalled(data.installed);

    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location = "/";
  };

  return (
    <>
      {initiated && (
        <>
          {installed ? (
            <section>
              <AppContext.Provider value={{ user, setUser, logout, socket }}>
                <Navbar />
                <Switch>
                  <Route path="/" exact>
                    {user ? <Dashboard /> : <DashboardGuest />}
                  </Route>

                  <Route path="/game">
                    {user ? <Game /> : <Redirect to="/auth/login" />}
                  </Route>

                  {/* <Route path="/billing">
                    {user ? <Billing /> : <Redirect to="/auth/login" />}
                  </Route>
                  <Route path="/membership">
                    {user ? <Membership /> : <Redirect to="/auth/login" />}
                  </Route> */}
                  <Route path="/auth/login">
                    {!user ? <Login /> : <Redirect to="/" />}
                  </Route>
                  <Route path="/auth/register">
                    {!user ? <Register /> : <Redirect to="/" />}
                  </Route>
                </Switch>
              </AppContext.Provider>
            </section>
          ) : (
            <Install />
          )}
        </>
      )}
    </>
  );
}

export default App;
