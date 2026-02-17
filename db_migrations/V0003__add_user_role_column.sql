ALTER TABLE t_p31590366_multi_page_site_dev_.users ADD COLUMN user_role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE t_p31590366_multi_page_site_dev_.users SET user_role = 'admin' WHERE id = 1;