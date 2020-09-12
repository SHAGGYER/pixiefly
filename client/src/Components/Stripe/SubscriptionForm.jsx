import React, { useContext, useState } from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import Button from "../Button/Button";
import HttpClient from "../../Services/HttpClient";
import AppContext from "../../Contexts/AppContext";

const CheckoutForm = ({ stripe, elements, setActiveStep }) => {
  const { setUser } = useContext(AppContext);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setSubmitting(true);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement("cardNumber"),
      billing_details: {
        name,
        email,
      },
    });

    await stripePaymentMethodHandler(result);
  };

  const stripePaymentMethodHandler = async (result) => {
    if (result.error) {
      setErrors([result.error.message]);
      setSubmitting(false);
    } else {
      try {
        const { data } = await HttpClient().post(
          "/api/billing/create-subscription",
          {
            email,
            name,
            paymentMethod: result.paymentMethod.id,
          }
        );

        setActiveStep((prevState) => prevState + 1);
        setUser(data);
      } catch (e) {
        setErrors([e.response.data.message.raw.message]);
        setSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Total: 99 kr. / måned
      </h2>
      {!!errors.length && (
        <article className="bg-red-600 text-white p-2 mb-2">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </article>
      )}
      <div className="w-100">
        <input
          className="card__element mb-1"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="card__element mb-1"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CardSection />
      </div>
      <div className="flex mt-4">
        <Button
          className="mr-1 bg-red-600 text-white"
          onClick={() => setActiveStep((prevState) => prevState - 1)}
        >
          Tilbage
        </Button>
        <Button
          className="bg-green-600 text-white"
          type="submit"
          loading={submitting}
          disabled={submitting}
        >
          Abonnér
        </Button>
      </div>
    </form>
  );
};

export default injectStripe(CheckoutForm);
