const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || "https://YOUR_DOMAIN.com").trim().replace(/\/+$/, "");

export const TERMS_VERSION = "2026-05-13";
export const PRIVACY_VERSION = "2026-05-13";

const currentSupportEmail = (process.env.EXPO_PUBLIC_SUPPORT_EMAIL || "shkruajshpejt@gmail.com").trim();
const previousSupportEmail = ["muhamedkryeziu02", "gmail.com"].join("@");

export const supportEmail = currentSupportEmail === previousSupportEmail ? "shkruajshpejt@gmail.com" : currentSupportEmail;

export const legalUrls = {
  base: siteUrl,
  privacy: `${siteUrl}/privacy`,
  terms: `${siteUrl}/terms`,
  refund: `${siteUrl}/refund`,
  contact: `${siteUrl}/contact`,
  deleteAccount: `${siteUrl}/delete-account`
};
