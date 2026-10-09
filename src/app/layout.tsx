import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import { ThemeProvider } from "@/components/theme";
import FixedLogoOverlays from "@/components/fixed-logo-overlays";
import { getSiteFont } from "@/lib/branding-config";
import { getBranding } from "@/lib/settings";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBranding();
  const siteUrl = getSiteUrl();
  const title = `${branding.clubName} — ${branding.schoolName}`;
  const description = `${branding.schoolName}, রংপুরের অফিসিয়াল ${branding.clubName}। বিজ্ঞান অলিম্পিয়াড, শিক্ষার্থী অর্জন, প্রকল্প, ক্লাব কার্যক্রম ও সদস্যদের পরিচিতি জানুন।`;
  const logoUrl = branding.clubLogo ? toAbsoluteUrl(branding.clubLogo) : "";
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim()
    || "YYY8OrNn1NTUjHJcVeg-u3eu-1ojBLjXqw8ZW1k9j6Q";
  const metadata: Metadata = {
    metadataBase: siteUrl,
    applicationName: branding.clubName,
    title: {
      default: title,
      template: `%s | ${branding.clubName}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: siteUrl.toString(),
      siteName: branding.clubName,
      type: "website",
      locale: "bn_BD",
      ...(logoUrl ? { images: [{ url: logoUrl, alt: branding.clubName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(logoUrl ? { images: [logoUrl] } : {}),
    },
    verification: { google: googleVerification },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };

  if (branding.clubLogo) {
    metadata.icons = {
      icon: branding.clubLogo,
      shortcut: branding.clubLogo,
      apple: branding.clubLogo,
    };
  }

  return metadata;
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const branding = await getBranding();
  const siteFont = getSiteFont(branding.siteFont);
  const fontVariables = {
    "--site-font-sans": siteFont.css,
    "--site-font-display": siteFont.css,
  } as CSSProperties;
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");
  const organizationId = `${siteUrl}/#organization`;
  const logoUrl = branding.clubLogo ? toAbsoluteUrl(branding.clubLogo) : "";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": organizationId,
        name: branding.clubName,
        alternateName: "Science Club of Bir Uttam Shaheed Samad School & College",
        url: siteUrl,
        ...(logoUrl ? { logo: logoUrl } : {}),
        parentOrganization: { "@type": "School", name: branding.schoolName },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rangpur",
          addressRegion: "Rangpur Division",
          addressCountry: "BD",
        },
        areaServed: { "@type": "City", name: "Rangpur" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: branding.clubName,
        inLanguage: "bn-BD",
        publisher: { "@id": organizationId },
      },
    ],
  };
  const structuredDataText = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <html lang="bn-BD" suppressHydrationWarning style={fontVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataText }} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="ambient" aria-hidden />
          {children}
          <FixedLogoOverlays placements={branding.fixedLogos} />
        </ThemeProvider>
      </body>
    </html>
  );
}
