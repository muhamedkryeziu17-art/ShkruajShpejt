const siteUrl = (import.meta.env.VITE_SITE_URL || "https://YOUR_DOMAIN.com").trim().replace(/\/+$/, "");

export const supportEmail = (import.meta.env.VITE_SUPPORT_EMAIL || "muhamedkryeziu02@gmail.com").trim();

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
