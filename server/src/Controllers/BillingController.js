const express = require("express");
const router = express.Router();
const User = require("../Models/User");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/delete-payment-method", async (req, res) => {
  const user = await User.findById(req.userId);

  await stripe.paymentMethods.detach(user.stripePaymentMethodId);

  user.stripePaymentMethodId = null;
  await user.save();

  res.sendStatus(200);
});

router.get("/get-payment-method", async (req, res) => {
  const user = await User.findById(req.userId);

  if (user.stripePaymentMethodId) {
    const response = await stripe.paymentMethods.retrieve(
      user.stripePaymentMethodId
    );
    res.send(response);
  } else {
    res.send(null);
  }
});

router.post("/create-payment-method", async (req, res) => {
  const user = await User.findById(req.userId);
  await stripe.paymentMethods.attach(req.body.paymentMethod.id, {
    customer: user.stripeCustomerId,
  });
  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: req.body.paymentMethod.id,
    },
  });

  user.stripePaymentMethodId = req.body.paymentMethod.id;
  await user.save();

  res.send(req.body.paymentMethod);
});

router.post("/create-subscription", async (req, res) => {
  const user = await User.findById(req.userId);
  let customer;
  let subscription;

  if (user.stripeCustomerId) {
    customer = await stripe.customers.retrieve(user.stripeCustomerId);
    if (!user.stripePaymentMethodId) {
      await stripe.paymentMethods.attach(req.body.paymentMethod, {
        customer: user.stripeCustomerId,
      });

      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: req.body.paymentMethod,
        },
      });

      user.stripePaymentMethodId = req.body.paymentMethod;
    }
  }

  if (!customer) {
    try {
      customer = await stripe.customers.create({
        email: req.body.email,
        name: req.body.name,
        payment_method: req.body.paymentMethod,
        invoice_settings: {
          default_payment_method: req.body.paymentMethod,
        },
      });

      user.stripePaymentMethodId = req.body.paymentMethod;
    } catch (e) {
      res.status(400).send({ message: e });
    }
  }

  subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        plan: "coingo_premium",
      },
    ],
    expand: ["latest_invoice.payment_intent"],
  });

  user.stripeCustomerId = customer.id;
  user.stripeSubscriptionId = subscription.id;
  user.stripeSubscriptionStatus = "active";
  await user.save();

  res.send(user);
});

router.post("/cancel-subscription", async (req, res) => {
  const user = await User.findById(req.userId);

  await stripe.subscriptions.del(user.stripeSubscriptionId);

  user.stripeSubscriptionStatus = null;
  user.stripeSubscriptionId = null;
  await user.save();
  res.sendStatus(200);
});

router.post("/get-payment-intent", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.total * 100,
    currency: "usd",
  });

  return res.send(paymentIntent);
});

module.exports = router;
