import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Oxerfy";
const DEFAULT_TITLE = "OXERFY | Digital Agency — Web, AI & Marketing";
const DEFAULT_DESC = "Oxerfy is a digital agency offering WordPress Web Development, AI Automation, Meta Marketing, and Social Media Management. Based in Dhaka, serving clients worldwide.";
const DEFAULT_IMAGE = "https://oxerfy.vercel.app/og-image.jpg";
const BASE_URL = "https://oxerfy.vercel.app";

export function MetaTags({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  noIndex = false,
}: MetaTagsProps) {
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1408" />
      <meta property="og:image:height" content="736" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@oxerfy" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${title}`} />
    </Helmet>
  );
}
