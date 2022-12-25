const auth = require("./auth");
const airline = require("./airlines");
const airplane = require("./airplane");
const product = require("./product");
const airport = require("./airport");
const transaction = require("./transaction");
const payment = require("./payment");
const user = require("./user");
const booking = require("./booking");
const qrcode = require("./qr-code");

module.exports = {
  auth,
  airline,
  airplane,
  product,
  airport,
  transaction,
  payment,
  booking,
  user,
  qrcode,
};
