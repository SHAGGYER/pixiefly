import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../Components/Input/Input";
import validator from "validator";
import Button from "../../Components/Button/Button";
import HttpClient from "../../Services/HttpClient";

export default () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError({});
    const _error = {};

    if (!displayName.trim()) _error.displayName = "Displaynavn er påkrævet";
    if (!validator.isEmail(email))
      _error.email = "Email skal være i korrekt format";
    if (!password.trim()) _error.password = "Kodeord er påkrævet";
    if (!passwordAgain.trim())
      _error.passwordAgain = "Kodeord bekræftelse er påkrævet";
    else if (password !== passwordAgain)
      _error.passwordAgain = "Kodeord skal være ens";

    if (Object.keys(_error).length) return setError(_error);

    setLoading(true);
    const data = {
      email,
      displayName,
      password,
    };
    const response = await HttpClient().post("/api/auth/register", data);
    localStorage.setItem("token", response.data.token);
    window.location = "/";
  };

  return (
    <section className="mx-auto w-1/2 mt-10 p-4 shadow-xl">
      <h1 className="text-3xl mb-4 text-center">Opret Bruger</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <Input
            value={displayName}
            onChange={setDisplayName}
            label="Displaynavn"
            error={error.displayName}
          />
        </div>
        <div className="mb-4">
          <Input
            value={email}
            onChange={setEmail}
            label="Email"
            error={error.email}
          />
        </div>
        <div className="mb-4">
          <Input
            value={password}
            onChange={setPassword}
            label="Kodeord"
            error={error.password}
            type="password"
          />
        </div>
        <div className="mb-4">
          <Input
            value={passwordAgain}
            onChange={setPasswordAgain}
            label="Kodeord Igen"
            error={error.passwordAgain}
            type="password"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            loading={loading}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
            type="submit"
          >
            Opret Bruger
          </Button>

          <Link to="/auth/login" className="text-blue-700 hover:underline">
            Log Ind
          </Link>
        </div>
      </form>
    </section>
  );
};
