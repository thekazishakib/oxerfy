import React from "react";
import { MetaTags } from "../components/MetaTags";
import { Link } from "react-router-dom";

const s = {
  h2: { color: "#F5EEDD", fontWeight: 700, fontSize: "1.25rem", marginTop: "2.5rem", marginBottom: "0.75rem" } as React.CSSProperties,
  p: { color: "rgba(245,238,221,0.8)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "0.75rem" } as React.CSSProperties,
};

export default function Disclaimer() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", padding: "6rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#20BD5A", textDecoration: "none", display: "block", marginBottom: "2rem" }}>&larr; Back to Home</Link>
        <h1 style={{ color: "#F5EEDD", fontWeight: 700, fontSize: "2rem", marginBottom: "0.5rem" }}>Disclaimer</h1>
        <p style={{ color: "rgba(245,238,221,0.45)", fontSize: "0.85rem", marginBottom: "2rem" }}>Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>

        <h2 style={s.h2}>⚠ Read Before Proceeding</h2>
        <p style={s.p}>By accessing or using Oxerfy's website and services, you acknowledge that you have read, understood, and agreed to this Disclaimer in full.</p>

        <h2 style={s.h2}>01 General Information Only</h2>
        <p style={s.p}>All content published on oxerfy.com is provided for general informational and promotional purposes only. While we strive for accuracy, Oxerfy makes no representations or warranties of any kind regarding the completeness, reliability, or suitability of the information provided.</p>

        <h2 style={s.h2}>02 No Financial or Investment Advice</h2>
        <p style={s.p}>Nothing on this website constitutes financial, investment, or business advice. Any pricing, ROI estimates, or projected outcomes mentioned are illustrative only and not guarantees of results.</p>

        <h2 style={s.h2}>03 No Professional or Legal Advice</h2>
        <p style={s.p}>Content on this site does not constitute legal, tax, or professional advice. You should consult a qualified professional before making any decisions based on information found on this website.</p>

        <h2 style={s.h2}>04 No Guarantee of Results</h2>
        <p style={s.p}>Oxerfy does not guarantee specific results from its services. Digital marketing, SEO, automation, and web development outcomes depend on many external factors beyond our control.</p>

        <h2 style={s.h2}>05 Third-Party Links</h2>
        <p style={s.p}>Our website may contain links to third-party websites. Oxerfy has no control over their content or practices and accepts no responsibility for them. Visiting linked sites is at your own risk.</p>

        <h2 style={s.h2}>06 Limitation of Liability</h2>
        <p style={s.p}>To the fullest extent permitted by law, Oxerfy shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or our services.</p>

        <h2 style={s.h2}>07 Changes to This Disclaimer</h2>
        <p style={s.p}>Oxerfy reserves the right to update this Disclaimer at any time. Changes take effect immediately upon publication on this page.</p>

        <h2 style={s.h2}>08 Contact</h2>
        <p style={s.p}>Questions about this Disclaimer? Contact us at: <strong style={{ color: "#F5EEDD" }}>oxerfy@gmail.com</strong></p>
      </div>
    </div>
  );
}
