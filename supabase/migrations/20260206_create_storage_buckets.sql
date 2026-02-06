-- Create a new bucket for profiles if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do update set public = true;

-- Allow public access to read files
create policy "Allow Public Access to Profiles"
on storage.objects for select
using (bucket_id = 'profiles');

-- Allow authenticated users to upload files to the profiles bucket
create policy "Allow Authenticated Users to Upload"
on storage.objects for insert
with check (
  bucket_id = 'profiles' 
  and auth.role() = 'authenticated'
);

-- Allow users to update their own files
create policy "Allow Users to Update Their Own Files"
on storage.objects for update
using (
  bucket_id = 'profiles' 
  and (storage.foldername(name))[1] = 'avatars'
  and (storage.filename(name)) ilike auth.uid() || '%'
);

-- Allow users to delete their own files
create policy "Allow Users to Delete Their Own Files"
on storage.objects for delete
using (
  bucket_id = 'profiles' 
  and (storage.foldername(name))[1] = 'avatars'
  and (storage.filename(name)) ilike auth.uid() || '%'
);
