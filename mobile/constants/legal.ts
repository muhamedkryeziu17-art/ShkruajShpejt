const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || "https://YOUR_DOMAIN.com").trim().replace(/\/+$/, "");

export const TERMS_VERSION = "2026-05-13";
export const PRIVACY_VERSION = "2026-05-13";

export const supportEmail = "muhamedkryeziu02@gmail.com";

export const legalUrls = {
  base: siteUrl,
  privacy: `${siteUrl}/privacy`,
  terms: `${siteUrl}/terms`,
  refund: `${siteUrl}/refund`,
  contact: `${siteUrl}/contact`,
  deleteAccount: `${siteUrl}/delete-account`
};
