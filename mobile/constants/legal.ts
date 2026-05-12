const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || "https://YOUR_DOMAIN.com").trim().replace(/\/+$/, "");

export const supportEmail = "support@YOUR_DOMAIN.com";

export const legalUrls = {
  base: siteUrl,
  privacy: `${siteUrl}/privacy`,
  terms: `${siteUrl}/terms`,
  refund: `${siteUrl}/refund`,
  contact: `${siteUrl}/contact`,
  deleteAccount: `${siteUrl}/delete-account`
};
