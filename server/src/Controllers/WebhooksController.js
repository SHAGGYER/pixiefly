const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/stripe", async (req, res) => {
  const { type, data } = req.body;
  const { object } = data;
  const { customer, status } = object;

  if (
    type === "customer.subscription.deleted" ||
    type === "customer.subscription.updated"
  ) {
    const user = await User.findOne({ stripeCustomerId: customer });
    if (user) {
      if (status === "canceled") {
        user.stripeSubscriptionStatus = null;
        user.stripeSubscriptionId = null;
      } else if (status === "past_due") {
        await stripe.subscriptions.del(user.stripeSubscriptionId);
        user.stripeSubscriptionStatus = null;
        user.stripeSubscriptionId = null;
      }
      await user.save();
    }
  }

  res.sendStatus(200);
});

module.exports = router;
