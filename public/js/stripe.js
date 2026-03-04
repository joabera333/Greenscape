
// axios is provided globally by CDN script tag
import { showAlert } from './alerts.js';
const stripe = Stripe('pk_test_51T54vn0RvEVfrQyIaxhT54g9ojpOQp8gzR3tPDzDkfEPflIvQbubv6jG9RLg8MTr7XBOHHSUFDPuRTe1KRY2aqIu005hosfWMF');

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);
        //create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log('checkout error', err);
        const msg =
            err.response?.data?.message ||
            err.message ||
            'Could not create checkout session';
        showAlert('error', msg);
    }
};
