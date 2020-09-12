import React, { useState } from "react";
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

    if (!displayName.trim()) _error.displayName = "Display Name is required";
    if (!validator.isEmail(email))
      _error.email = "Email must be in correct format";
    if (!password.trim()) _error.password = "Password is required";
    if (!passwordAgain.trim())
      _error.passwordAgain = "Password confirmation is required";
    else if (password !== passwordAgain)
      _error.passwordAgain = "Passwords must match";

    if (Object.keys(_error).length) return setError(_error);

    setLoading(true);
    const data = {
      email,
      displayName,
      password,
    };
    await HttpClient().post("/api/auth/install", data);
    window.location = "/";
  };

  return (
    <section className="mx-auto w-1/2 mt-10 p-4 shadow-xl">
      <h1 className="text-3xl mb-4 text-center">Install Software</h1>

      <form onSubmit={onSubmit}>
        <Input
          value={displayName}
          onChange={setDisplayName}
          label="Display Name"
          error={error.displayName}
        />
        <Input
          value={email}
          onChange={setEmail}
          label="Email"
          error={error.email}
        />
        <Input
          value={password}
          onChange={setPassword}
          label="Password"
          error={error.password}
          type="password"
        />
        <Input
          value={passwordAgain}
          onChange={setPasswordAgain}
          label="Password Confirmation"
          error={error.passwordAgain}
          type="password"
        />

        <Button
          loading={loading}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
          type="submit"
        >
          Install
        </Button>
      </form>
    </section>
  );
};
