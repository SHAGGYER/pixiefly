import React, {useContext, useState} from 'react';
import AppContext from "../../Contexts/AppContext";
import {injectStripe} from 'react-stripe-elements';

import CardSection from './CardSection';
import FormErrors from "../FormErrors/FormErrors";
import Button from "../Button/Button";

const CheckoutForm = ({stripe, elements, setActiveStep, total, setPaymentId}) => {
    const {paymentIntent} = useContext(AppContext);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setSubmitting(true);
        const response = await stripe.confirmCardPayment(paymentIntent, {
            payment_method: {
                card: elements.getElement('cardNumber'),
                billing_details: {
                    name,
                    email
                },
            }
        });

        if (response.paymentIntent && response.paymentIntent.status === "succeeded") {
            setPaymentId(response.paymentIntent.id);
        } else {
            setErrors([response.error.message]);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{paddingTop: "1rem"}}>
            <h2 style={{textAlign: "center", marginBottom: "1rem"}}>Total: {total} kr.</h2>
            {!!errors.length && <FormErrors errors={errors}/>}
            <input className="card__element mb-1" placeholder="Navn" value={name}
                   onChange={e => setName(e.target.value)}/>
            <input className="card__element mb-1" placeholder="Email" value={email}
                   onChange={e => setEmail(e.target.value)}/>
            <CardSection/>
            <div className="mt-2">
                <Button className="mr-1" onClick={() => setActiveStep(prevState => prevState - 1)}>
                    Gå Tilbage
                </Button>
                <Button type="submit" loading={submitting} disabled={submitting}>Betal</Button>
            </div>

        </form>
    );
}

export default injectStripe(CheckoutForm);