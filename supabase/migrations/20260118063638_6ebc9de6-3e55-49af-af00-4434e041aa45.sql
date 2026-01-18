-- Create addresses table for storing user billing and shipping addresses
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  address_type TEXT NOT NULL CHECK (address_type IN ('billing', 'shipping')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  country TEXT NOT NULL,
  street_address TEXT NOT NULL,
  street_address_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint for one default address per type per user
CREATE UNIQUE INDEX idx_addresses_default_per_type ON public.addresses (user_id, address_type) WHERE is_default = true;

-- Enable Row Level Security
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - using user_id as TEXT to match external auth
CREATE POLICY "Users can view their own addresses" 
ON public.addresses 
FOR SELECT 
USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create their own addresses" 
ON public.addresses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own addresses" 
ON public.addresses 
FOR UPDATE 
USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own addresses" 
ON public.addresses 
FOR DELETE 
USING (user_id = current_setting('app.current_user_id', true));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();