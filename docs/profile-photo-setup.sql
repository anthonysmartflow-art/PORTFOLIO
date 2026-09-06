-- Applied to the portfolio Supabase project as add_admin_profile_photo_upload.
-- Public images; only the existing approved admin can upload. No overwrite/delete grants.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('profile-photos','profile-photos',true,5242880,array['image/webp']);
create policy "Approved admin uploads profile photos" on storage.objects
for insert to authenticated with check (
 bucket_id='profile-photos'
 and (select auth.uid())='9667751f-ba88-45cf-b05e-14898ee47bb2'::uuid
 and name ~ '^portrait/[0-9a-f-]{36}[.]webp$'
);
insert into public.site_content(id,content) values ('profile_photo','/projects/Headshot.png');
