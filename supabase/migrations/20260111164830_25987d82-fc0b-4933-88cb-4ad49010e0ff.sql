-- Add database constraints for input validation

-- Reviews table constraints
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_title_length CHECK (title IS NULL OR length(title) <= 200);

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_content_length CHECK (content IS NULL OR length(content) <= 5000);

-- Published books table constraints
ALTER TABLE public.published_books 
ADD CONSTRAINT published_books_title_length CHECK (length(title) <= 500);

ALTER TABLE public.published_books 
ADD CONSTRAINT published_books_author_length CHECK (length(author) <= 200);

ALTER TABLE public.published_books 
ADD CONSTRAINT published_books_description_length CHECK (description IS NULL OR length(description) <= 10000);

ALTER TABLE public.published_books 
ADD CONSTRAINT published_books_price_nonnegative CHECK (price >= 0);

-- Profiles table constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_full_name_length CHECK (full_name IS NULL OR length(full_name) <= 200);

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_avatar_url_length CHECK (avatar_url IS NULL OR length(avatar_url) <= 2000);

-- Cart items quantity constraint
ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0);

-- Orders total constraint
ALTER TABLE public.orders 
ADD CONSTRAINT orders_total_nonnegative CHECK (total >= 0);

-- Wishlist constraints
ALTER TABLE public.wishlist 
ADD CONSTRAINT wishlist_book_title_length CHECK (length(book_title) <= 500);

ALTER TABLE public.wishlist 
ADD CONSTRAINT wishlist_book_author_length CHECK (length(book_author) <= 200);

ALTER TABLE public.wishlist 
ADD CONSTRAINT wishlist_book_price_nonnegative CHECK (book_price >= 0);

-- Order items constraints
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_book_title_length CHECK (length(book_title) <= 500);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_book_author_length CHECK (length(book_author) <= 200);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_price_nonnegative CHECK (price >= 0);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);