-- Create cv_uploads table to store uploaded CV files
create table if not exists public.cv_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  analysis_result jsonb,
  extracted_info jsonb, -- Store extracted email, phone, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cv_uploads enable row level security;

-- Create policies for cv_uploads
create policy "cv_uploads_select_own"
  on public.cv_uploads for select
  using (auth.uid() = user_id);

create policy "cv_uploads_insert_own"
  on public.cv_uploads for insert
  with check (auth.uid() = user_id);

create policy "cv_uploads_update_own"
  on public.cv_uploads for update
  using (auth.uid() = user_id);

create policy "cv_uploads_delete_own"
  on public.cv_uploads for delete
  using (auth.uid() = user_id);
