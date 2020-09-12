import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Elements, StripeProvider } from "react-stripe-elements";
import AddCardForm from "../../../../Components/Stripe/AddCardForm";

export default function ({ isOpen, onClose, setPaymentMethod }) {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <Modal isOpen={isModalOpen} onRequestClose={onClose}>
        {isModalOpen && (
          <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}>
            <Elements locale="da">
              <AddCardForm
                setModalOpen={setModalOpen}
                setPaymentMethod={setPaymentMethod}
              />
            </Elements>
          </StripeProvider>
        )}
      </Modal>
    </div>
  );
}
