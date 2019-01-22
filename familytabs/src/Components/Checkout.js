import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

const CURRENCY = 'USD';

const dollarToCent = amount => amount * 100;

const successPayment = data => {
  alert('Payment Successful');
};

const errorPayment = data => {
  alert('Payment Error'+data);
};

const onToken = (amount, description) => token =>
  axios.post(`${process.env.REACT_APP_API_URL}/stripe`,
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: dollarToCent(amount)
    })
    .then(successPayment)
    .catch(errorPayment);

const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={dollarToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={process.env.REACT_APP_SPK}
  />

export default Checkout;