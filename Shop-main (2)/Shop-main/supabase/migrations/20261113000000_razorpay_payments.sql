ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_razorpay_order_id_unique
  ON public.orders (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_payment_id_unique
  ON public.payments (razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.complete_razorpay_payment(
  p_razorpay_order_id text,
  p_razorpay_payment_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saved_order public.orders%ROWTYPE;
  saved_payment_id text;
BEGIN
  SELECT *
  INTO saved_order
  FROM public.orders
  WHERE razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Razorpay order was not found.';
  END IF;

  SELECT razorpay_payment_id
  INTO saved_payment_id
  FROM public.payments
  WHERE order_id = saved_order.id
  FOR UPDATE;

  IF saved_order.payment_status = 'Paid' THEN
    IF saved_payment_id IS DISTINCT FROM p_razorpay_payment_id THEN
      RAISE EXCEPTION 'Order was already completed with a different payment.';
    END IF;
    RETURN jsonb_build_object('order_id', saved_order.id, 'payment_status', 'Paid');
  END IF;

  UPDATE public.payments
  SET status = 'Paid',
      razorpay_payment_id = p_razorpay_payment_id
  WHERE order_id = saved_order.id
    AND status = 'Pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending payment record was not found.';
  END IF;

  UPDATE public.orders
  SET payment_status = 'Paid',
      status = 'Confirmed'
  WHERE id = saved_order.id;

  RETURN jsonb_build_object('order_id', saved_order.id, 'payment_status', 'Paid');
END;
$$;

REVOKE ALL ON FUNCTION public.complete_razorpay_payment(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_razorpay_payment(text, text) TO service_role;
