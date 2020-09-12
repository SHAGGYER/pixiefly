import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import "./Billing.css";
import Subscription from "./Subscription/Subscription";
import Card from "./Card/Card";
import { useHistory } from "react-router-dom";
import Page from "../../Components/Page/Page";

export default function () {
  const history = useHistory();
  const { user, setPageTitle } = useContext(AppContext);
  const [menu, setMenu] = useState("subscription");

  useEffect(() => {
    if (!user.stripeCustomerId) {
      return history.push("/membership");
    }
  }, []);

  return (
    <Page>
      <div className="page-fluid pa-1">
        <section className="billing">
          <article className="list">
            <div className="list__item">
              <button
                className="list__link"
                onClick={() => setMenu("subscription")}
              >
                Abonnement
              </button>
            </div>
            <div className="list__item">
              <button className="list__link" onClick={() => setMenu("card")}>
                Kort
              </button>
            </div>
          </article>
          <article className="billing__right">
            {menu === "subscription" && <Subscription />}
            {menu === "card" && <Card />}
          </article>
        </section>
      </div>
    </Page>
  );
}
