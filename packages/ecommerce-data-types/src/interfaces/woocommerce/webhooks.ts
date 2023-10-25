export interface WoocommerceWebhookResponse {
  id: number;
  name: string;
  status: string;
  topic: string;
  resource: string;
  event: string;
  hooks: string[];
  delivery_url: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
  };
}
