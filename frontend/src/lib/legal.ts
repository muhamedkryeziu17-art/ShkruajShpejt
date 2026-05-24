const browserSiteUrl = typeof window === "undefined" ? "" : window.location.origin;
const siteUrl = (import.meta.env.VITE_SITE_URL || browserSiteUrl).trim().replace(/\/+$/, "");

const currentSupportEmail = (import.meta.env.VITE_SUPPORT_EMAIL || "shkruajshpejt@gmail.com").trim();
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

export function mailTo(subject = "", body = "") {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: supportEmail
  });

  if (subject) {
    params.set("su", subject);
  }

  if (body) {
    params.set("body", body);
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
}
