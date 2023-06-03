CREATE TABLE IF NOT EXISTS "article" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"author_id" varchar(256),
	"slug" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" varchar(256) NOT NULL,
	"article_id" varchar(256) NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "favorite" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"article_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "follow" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"follower_id" varchar(256) NOT NULL,
	"followee_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tag" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"article_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"emailVerified" timestamp,
	"bio" text,
	"image" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "posts__user_id__idx" ON "article" ("author_id");
CREATE INDEX IF NOT EXISTS "comments__user_id__idx" ON "comment" ("author_id");
CREATE INDEX IF NOT EXISTS "comments__article_id__idx" ON "comment" ("article_id");
CREATE INDEX IF NOT EXISTS "favorites__user_id__idx" ON "favorite" ("user_id");
CREATE INDEX IF NOT EXISTS "favorites__article_id__idx" ON "favorite" ("article_id");
CREATE INDEX IF NOT EXISTS "follows__follower_id__idx" ON "follow" ("follower_id");
CREATE INDEX IF NOT EXISTS "follows__followee_id__idx" ON "follow" ("followee_id");
CREATE INDEX IF NOT EXISTS "tags__article_id__idx" ON "tag" ("article_id");
DO $$ BEGIN
 ALTER TABLE "article" ADD CONSTRAINT "article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "favorite" ADD CONSTRAINT "favorite_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_followee_id_user_id_fk" FOREIGN KEY ("followee_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tag" ADD CONSTRAINT "tag_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
