export interface Customer {
  id: string;

  customer_code: string;

  first_name: string | null;

  last_name: string | null;

  email: string | null;

  phone: string | null;

  city: string | null;

  state: string | null;

  pincode?: string | null;

  status: string | null;

  created_at: string | null;

  auth_user_id: string | null;
}
