import React from "react";
import { MetaTags } from "../components/MetaTags";
import { Link } from "react-router-dom";

const s = {
  h2: { color: "#F5EEDD", fontWeight: 700, fontSize: "1.25rem", marginTop: "2.5rem", marginBottom: "0.75rem" } as React.CSSProperties,
  h3: { color: "#F5EEDD", fontWeight: 700, fontSize: "1.1rem", marginTop: "1.5rem", marginBottom: "0.5rem" } as React.CSSProperties,
  p: { color: "rgba(245,238,221,0.8)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "0.75rem" } as React.CSSProperties,
  li: { color: "rgba(245,238,221,0.8)", fontSize: "0.95rem", lineHeight: 1.8 } as React.CSSProperties,
};

export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", padding: "6rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#20BD5A", textDecoration: "none", display: "block", marginBottom: "2rem" }}>&larr; Back to Home</Link>
        <h1 style={{ color: "#F5EEDD", fontWeight: 700, fontSize: "2rem", marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ color: "rgba(245,238,221,0.45)", fontSize: "0.85rem", marginBottom: "2rem" }}>Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>

        <h2 style={s.h2}>01 Who We Are</h2>
        <p style={s.p}>Oxerfy is a digital agency based in Dhaka, Bangladesh. We provide WordPress web development, AI automation, Meta marketing, social media management, and related digital services.</p>

        <h2 style={s.h2}>02 Information We Collect</h2>
        <h3 style={s.h3}>▶ Information You Provide</h3>
        <p style={s.p}>When you contact us or use our services, we may collect your name, email address, phone/WhatsApp number, project details, and any other information you voluntarily share.</p>
        <h3 style={s.h3}>▶ Information Collected Automatically</h3>
        <p style={s.p}>We may collect basic analytics data such as pages visited, browser type, and approximate location via third-party tools like Google Analytics or Firebase.</p>

        <h2 style={s.h2}>03 How We Use Your Information</h2>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["To respond to inquiries and deliver requested services","To communicate project updates and important notices","To improve our website and service quality","To comply with legal obligations"].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>04 Data Sharing</h2>
        <p style={s.p}>We do not sell, rent, or trade your personal information to third parties. We may share data with trusted service providers strictly for operational purposes under confidentiality agreements.</p>

        <h2 style={s.h2}>05 Data Retention</h2>
        <p style={s.p}>We retain your data only as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request deletion of your data at any time.</p>

        <h2 style={s.h2}>06 Your Rights</h2>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["Access the personal data we hold about you","Request correction or deletion of your data","Withdraw consent for data processing at any time","Lodge a complaint with a relevant authority"].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>07 Cookies</h2>
        <p style={s.p}>Our website may use cookies for analytics and functionality. You can disable cookies in your browser settings, though this may affect some features of the site.</p>

        <h2 style={s.h2}>08 Contact</h2>
        <p style={s.p}>For any privacy-related questions or requests, contact us at: <strong style={{ color: "#F5EEDD" }}>oxerfy@gmail.com</strong></p>
      </div>
    </div>
  );
}
