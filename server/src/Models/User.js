const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    displayName: String,
    email: String,
    password: String,
    role: String,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripeSubscriptionStatus: String,
    stripePaymentMethodId: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
