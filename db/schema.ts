import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("clients", { id:integer("id").primaryKey({autoIncrement:true}), name:text("name").notNull(), email:text("email").notNull().unique(), phone:text("phone"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const services = sqliteTable("services", { id:integer("id").primaryKey({autoIncrement:true}), name:text("name").notNull(), description:text("description").notNull().default(""), price:real("price").notNull(), active:integer("active",{mode:"boolean"}).notNull().default(true) });
export const orders = sqliteTable("orders", { id:integer("id").primaryKey({autoIncrement:true}), code:text("code").notNull().unique(), clientId:integer("client_id").notNull(), serviceId:integer("service_id"), title:text("title").notNull(), kind:text("kind").notNull().default("livro"), stage:text("stage").notNull().default("contratacao"), amount:real("amount").notNull(), deliveryDate:text("delivery_date"), status:text("status").notNull().default("active"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const messages = sqliteTable("messages", { id:integer("id").primaryKey({autoIncrement:true}), orderId:integer("order_id").notNull(), authorEmail:text("author_email").notNull(), body:text("body").notNull(), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const files = sqliteTable("files", { id:integer("id").primaryKey({autoIncrement:true}), orderId:integer("order_id").notNull(), storageKey:text("storage_key").notNull(), filename:text("filename").notNull(), mimeType:text("mime_type").notNull(), size:integer("size").notNull(), status:text("status").notNull().default("awaiting_review"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const products = sqliteTable("products", { id:integer("id").primaryKey({autoIncrement:true}), type:text("type").notNull(), title:text("title").notNull(), description:text("description").notNull().default(""), imageKey:text("image_key"), price:real("price"), active:integer("active",{mode:"boolean"}).notNull().default(true), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const refunds = sqliteTable("refunds", { id:integer("id").primaryKey({autoIncrement:true}), orderId:integer("order_id").notNull(), amount:real("amount").notNull(), reason:text("reason"), status:text("status").notNull().default("requested"), externalId:text("external_id"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const leads = sqliteTable("leads", {
  id:integer("id").primaryKey({autoIncrement:true}),
  name:text("name").notNull(),
  phone:text("phone").notNull(),
  email:text("email"),
  projectType:text("project_type").notNull(),
  packageInterest:text("package_interest"),
  projectSummary:text("project_summary").notNull(),
  preferredTime:text("preferred_time"),
  consent:integer("consent",{mode:"boolean"}).notNull().default(false),
  source:text("source").notNull().default("assistente_site"),
  status:text("status").notNull().default("novo"),
  createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
