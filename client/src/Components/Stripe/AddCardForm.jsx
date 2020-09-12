import React, { useContext, useState } from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import Button from "../Button/Button";
import HttpClient from "../../Services/HttpClient";
import AppContext from "../../Contexts/AppContext";

const AddCardForm = ({ stripe, elements, setPaymentMethod, setModalOpen }) => {
  const { setUser } = useContext(AppContext);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setSubmitting(true);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement("cardNumber"),
    });

    await stripePaymentMethodHandler(result);
  };

  const stripePaymentMethodHandler = async (result) => {
    if (result.error) {
      setErrors([result.error.message]);
      setSubmitting(false);
    } else {
      try {
        const response = await HttpClient().post(
          "/api/billing/create-payment-method",
          {
            paymentMethod: result.paymentMethod,
          }
        );
        setPaymentMethod(response.data);
        setModalOpen(false);
        setUser((prevState) => {
          return {
            ...prevState,
            stripePaymentMethodId: result.paymentMethod.id,
          };
        });
      } catch (e) {
        setErrors([e.response.data.message.raw.message]);
        setSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Tilføj Kort</h2>
      {!!errors.length && (
        <article className="bg-red-600 text-white p-2 mb-2">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </article>
      )}
      <div style={{ width: "600px" }}>
        <CardSection />
      </div>
      <div className="form__buttons" style={{ marginTop: "2rem" }}>
        <Button type="submit" loading={submitting} disabled={submitting}>
          Tilføj Kort
        </Button>
      </div>
    </form>
  );
};

export default injectStripe(AddCardForm);
