import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('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'); // Replace with your Stripe Secret Key

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }

        // Creating line items from the products array
        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Pickup Location: ${product.pickupLocation}\nDrop-Off Location: ${product.dropoffLocation}`, // Combine with newline
                },
                unit_amount: product.price * 100, // Amount in cents
            },
            quantity: product.quantity,
        }));

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/Success', // Change as per your frontend route
            cancel_url: 'http://localhost:3000/Cancel',
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

export default router;
