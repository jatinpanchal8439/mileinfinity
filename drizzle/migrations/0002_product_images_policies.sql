-- Admins can upload product images
create policy "Admins upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Admins can replace/delete their product images
create policy "Admins manage product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Anyone can view product images once the bucket is made public
create policy "Anyone can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');
