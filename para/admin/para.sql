-- --------------------------------------------------------------
-- Paragraphs Schema
-- Created by Payton Bissell 2.26.2021
-- 
-- Mod: 01/15/24
-- --------------------------------------------------------------
-- LATER: Users: recent pids, fav/recent wids, fav/recent tagsets
--   rating, seen, paths, relationships (pid-pid-info)
-- 
--   Paths: traversal ordered set of pids
-- 
--   Links: relationships (pid-pid-info)
-- 
-- For Postgres - Schema Version 0.0 (testing) - Crude and simple, work out the  kinks
-- --------------------------------------------------------------

-- --------------------------------------------------------------
-- Authors
-- -- --------------------------------------------------------------
drop table if exists auths;
create table auths
( aid    bigserial     not null, -- PK
  name   varchar(64)   not null, -- author of work
  primary key (aid)
);

-- --------------------------------------------------------------
-- Works of Authors
-- -- --------------------------------------------------------------
drop table if exists works;
create table works
( wid    bigserial     not null, -- PK
  aid    bigint        not null, -- FK: author of work
  title  varchar(128)  not null, -- title of work
  tags   text          not null default '', -- a set of tags to assign to each paragraph in this work.
  primary key (wid)
);

-- --------------------------------------------------------------
-- Paragraphs
-- --------------------------------------------------------------
drop table if exists paras;
create table paras
( pid    bigserial     not null, -- PK
  wid    bigint        not null, -- work source of the paragraph
  wloc   varchar(64)   not null, -- some text convention to locate this paragraph in the work: or a commentary...
  title  varchar(128)  not null, -- description of paragraph
  para   text          not null default '', -- text of paragraph (markup?)
  notes  text          not null default '', -- notes about this paragraph
  tags   text          not null default '', -- alpha string of tags (t1 t2 t3) (auth inserted automatically?)
  parent bigint        not null default 0, -- parent paragraph if this is a foot, a note, or a comment
  dttm   timestamp     not null default current_timestamp,           -- the dttm of creation.
  primary key (pid)
);

-- --------------------------------------------------------------
-- Tags - superset of all tags in the system
-- --------------------------------------------------------------
drop table if exists tags;
create table tags
( tag      varchar(32)   not null,     -- categories of paragraphs
  primary key (tag)
);

-- --------------------------------------------------------------
-- Prime tags available in the system (TBD)
-- --------------------------------------------------------------
insert into tags (tag) values ('feminine');
insert into tags (tag) values ('masculine');
insert into tags (tag) values ('myth');
insert into tags (tag) values ('history');

-- --------------------------------------------------------------
-- LATER: Facilitate text search tools...
-- --------------------------------------------------------------
-- ALTER TABLE paras ADD COLUMN pv tsvector GENERATED ALWAYS AS (to_tsvector('english', para)) STORED;
-- ALTER TABLE paras ADD COLUMN tv tsvector GENERATED ALWAYS AS (to_tsvector('english', tags)) STORED;
-- CREATE INDEX pv_idx ON paras USING GIN (pv);
-- CREATE INDEX tv_idx ON paras USING GIN (tv);

-- --------------------------------------------------------------
-- EOF