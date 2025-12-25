-- Create published_books table for user-published books
CREATE TABLE public.published_books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  cover_image text,
  category text NOT NULL DEFAULT 'General',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.published_books ENABLE ROW LEVEL SECURITY;

-- Anyone can view published books
CREATE POLICY "Anyone can view published books"
ON public.published_books
FOR SELECT
USING (true);

-- Users can create their own books
CREATE POLICY "Users can create their own books"
ON public.published_books
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own books
CREATE POLICY "Users can update their own books"
ON public.published_books
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own books
CREATE POLICY "Users can delete their own books"
ON public.published_books
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_published_books_updated_at
BEFORE UPDATE ON public.published_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();