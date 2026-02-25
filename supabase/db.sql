-- Enable UUID generation
create extension if not exists "pgcrypto";


-- USERS TABLE

create table users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  service_key_hash text not null,
  avatar_seed text,
  created_at timestamp with time zone default now(),
  is_suspended boolean default false,
  suspension_until timestamp with time zone
);


-- POSTS TABLE

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  body text not null,
  relate_count integer default 0,
  comment_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- RELATES TABLE

create table relates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);


-- COMMENTS TABLE

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  parent_comment_id uuid references comments(id) on delete cascade,
  body text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- INDEXES FOR PERFORMANCE


create index idx_posts_user_id on posts(user_id);
create index idx_posts_created_at on posts(created_at desc);

create index idx_comments_post_id on comments(post_id);
create index idx_comments_user_id on comments(user_id);

create index idx_relates_post_id on relates(post_id);
create index idx_relates_user_id on relates(user_id);