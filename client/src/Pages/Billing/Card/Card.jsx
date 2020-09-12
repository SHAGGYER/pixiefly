import React, { useContext, useEffect, useState } from "react";
import HttpClient from "../../../Services/HttpClient";
import Button from "../../../Components/Button/Button";
import AddCard from "./AddCard/AddCard";
import AppContext from "../../../Contexts/AppContext";

export default function () {
  const { setUser } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [gotResults, setGotResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCardOpen, setCardOpen] = useState(false);

  const getPaymentMethod = async () => {
    const { data } = await HttpClient().get("/api/billing/get-payment-method");
    setPaymentMethod(data);
    setGotResults(true);
  };

  const deletePaymentMethod = async () => {
    const data = {
      id: paymentMethod.id,
    };
    setLoading(true);
    await HttpClient().post("/api/billing/delete-payment-method", data);
    setLoading(false);
    setUser((prevState) => {
      return { ...prevState, stripePaymentMethodId: null };
    });
    setPaymentMethod(null);
  };

  useEffect(() => {
    getPaymentMethod();
  }, []);

  return (
    <div className="billing__section">
      <h2 className="billing__section-title">Kort</h2>
      {paymentMethod && (
        <div>
          <p>Kort: {paymentMethod.card.brand}</p>
          <p>
            Udløber: {paymentMethod.card.exp_month} /{" "}
            {paymentMethod.card.exp_year}
          </p>
          <p>Kortnummer: **** **** **** {paymentMethod.card.last4}</p>
        </div>
      )}
      {gotResults && !paymentMethod && (
        <Button onClick={() => setCardOpen(true)}>Tilføj Kort</Button>
      )}

      <AddCard
        isOpen={isCardOpen}
        onClose={() => setCardOpen(false)}
        setPaymentMethod={setPaymentMethod}
      />
    </div>
  );
}
