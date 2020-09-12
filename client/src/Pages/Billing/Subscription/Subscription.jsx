import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../../../Contexts/AppContext";
import Button from "../../../Components/Button/Button";
import HttpClient from "../../../Services/HttpClient";

export default function () {
  const history = useHistory();
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const cancelSubscription = async () => {
    setLoading(true);
    await HttpClient().post("/api/billing/cancel-subscription");
    setUser({
      ...user,
      stripeSubscriptionStatus: null,
      stripeSubscriptionId: null,
    });
    setLoading(false);
  };

  return (
    <div className="billing__section">
      <h2 className="billing__section-title">Abonnement</h2>
      {user.stripeSubscriptionId ? (
        <div>
          <p>Abonnement ID: {user.stripeSubscriptionId}</p>
          <p>Status: Aktiv</p>
          <Button
            disabled={loading}
            loading={loading}
            className="bg-red-600 text-white mt-1"
            onClick={cancelSubscription}
          >
            Annullér Abonnement
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Intet Abonnement</p>

          <Button
            className="bg-green-600 text-white"
            onClick={() => history.push("/membership")}
          >
            Tilføj Abonnement
          </Button>
        </div>
      )}
    </div>
  );
}
