# Razorpay setup

The storefront sends payment requests through Supabase Edge Functions. Razorpay
secret keys stay in Supabase and are never added to the Vite `.env` file.

## Configure and deploy

1. In the Supabase SQL Editor, run
   `migrations/20261113000000_razorpay_payments.sql`.
2. In the Supabase Dashboard, open **Edge Functions → Secrets** and add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
3. Install and log in to the Supabase CLI, link this project, then deploy:

   ```powershell
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy razorpay
   supabase functions deploy razorpay-webhook --no-verify-jwt
   ```

4. In the Razorpay Dashboard, create a webhook for
   `https://YOUR_PROJECT_REF.supabase.co/functions/v1/razorpay-webhook`.
   Subscribe to the `payment.captured` event. Use the same webhook secret you
   saved as `RAZORPAY_WEBHOOK_SECRET`.
5. Test with Razorpay **Test Mode** keys first. Switch to live keys only after a
   complete test payment and verification.

The `razorpay` function verifies the signed-in customer and reads current
product prices from Supabase before creating an order. The `razorpay-webhook`
function verifies Razorpay's signature against the raw request body and marks
the order paid only after a captured-payment event. The checkout callback also
verifies the payment directly with Razorpay.
