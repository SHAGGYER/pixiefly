import React, { useContext, useEffect, useState } from "react";
import PremiumImage from "../../Images/Premium.svg";
import { Step, Stepper } from "../../Components/Stepper/Stepper";
import Button from "../../Components/Button/Button";
import { Elements, StripeProvider } from "react-stripe-elements";
import SubscriptionForm from "../../Components/Stripe/SubscriptionForm";
import AppContext from "../../Contexts/AppContext";
import { useHistory } from "react-router-dom";
import HttpClient from "../../Services/HttpClient";
import Page from "../../Components/Page/Page";
import Check from "../../Images/check.svg";

export default function () {
  const history = useHistory();
  const { user, setUser } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.stripeSubscriptionId) {
      history.push("/billing");
    }
  }, []);

  const useDefaultPaymentMethod = async () => {
    try {
      setLoading(true);
      const { data } = await HttpClient().post(
        "/api/billing/create-subscription"
      );

      setLoading(false);
      setUser(data);
      setActiveStep((prevState) => prevState + 1);
    } catch (e) {
      setLoading(false);
      setErrors([e.response.data.message.raw.message]);
    }
  };

  return (
    <Page>
      <Stepper activeStep={activeStep}>
        <Step title="Medlemskab">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl mb-8">Køb Premium</h2>
            <img src={PremiumImage} className="w-64 mb-8" />
            <Button
              className="bg-blue-700 text-white"
              onClick={() => setActiveStep((prevState) => prevState + 1)}
            >
              Næste
            </Button>
          </div>
        </Step>
        <Step title="Betaling">
          {user.stripePaymentMethodId ? (
            <div>
              {!!errors.length && (
                <article className="bg-red-600 text-white p-2 mb-2">
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </article>
              )}
              <div className="flex flex-col items-center">
                <div className="bg-green-600 text-white p-4 mb-4">
                  Vi bruger dit aktive kort.
                </div>
                <Button
                  className="bg-green-600 text-white"
                  disabled={loading}
                  loading={loading}
                  onClick={useDefaultPaymentMethod}
                >
                  Abonnér
                </Button>
              </div>
            </div>
          ) : (
            <div className="pa-1">
              <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}>
                <Elements locale="da">
                  <SubscriptionForm setActiveStep={setActiveStep} />
                </Elements>
              </StripeProvider>
            </div>
          )}
        </Step>
        <Step title="Opsummering">
          <div className="flex flex-col items-center">
            <img src={Check} className="w-48 mb-8" />
            <h3 className="text-3xl">Du har nu Premium!</h3>
          </div>
        </Step>
      </Stepper>
    </Page>
  );
}
