import React from "react";
import { MetaTags } from "../components/MetaTags";
import { Link } from "react-router-dom";

const s = {
  h1: { color: "#F5EEDD", fontWeight: 700 } as React.CSSProperties,
  h2: { color: "#F5EEDD", fontWeight: 700, fontSize: "1.25rem", marginTop: "2.5rem", marginBottom: "0.75rem" } as React.CSSProperties,
  h3: { color: "#F5EEDD", fontWeight: 700, fontSize: "1.1rem", marginTop: "1.5rem", marginBottom: "0.5rem" } as React.CSSProperties,
  p: { color: "rgba(245,238,221,0.8)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "0.75rem" } as React.CSSProperties,
  li: { color: "rgba(245,238,221,0.8)", fontSize: "0.95rem", lineHeight: 1.8 } as React.CSSProperties,
};

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", padding: "6rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#20BD5A", textDecoration: "none", display: "block", marginBottom: "2rem" }}>&larr; Back to Home</Link>
        <h1 style={{ ...s.h1, fontSize: "2rem", marginBottom: "0.5rem" }}>Terms & Conditions</h1>
        <p style={{ color: "rgba(245,238,221,0.45)", fontSize: "0.85rem", marginBottom: "2rem" }}>Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>

        <h2 style={s.h2}>⚠ Please Read Carefully</h2>
        <p style={s.p}>By using any Oxerfy service, you confirm that you have read, understood, and agree to be fully bound by these Terms. If you do not agree, please do not proceed with any engagement.</p>

        <h2 style={s.h2}>01 About Oxerfy</h2>
        <p style={s.p}>Oxerfy is a fully remote, online-based digital agency operating from Dhaka, Bangladesh, with no physical client-facing office. All services, communications, project management, deliverables, and support are conducted exclusively through digital and online platforms.</p>
        <p style={s.p}>Oxerfy is founded and led by Kazi Shakib. Our mission is to bridge the gap between complex technology and beautiful design.</p>
        <h3 style={s.h3}>🏢 Trade License</h3>
        <p style={s.p}>Oxerfy is a legally registered business entity. Trade License No: TRAD/DNCC/045292/2025 — issued by Dhaka North City Corporation (DNCC), Bangladesh.</p>

        <h2 style={s.h2}>02 Services We Provide</h2>
        <p style={s.p}>Oxerfy offers the following digital services:</p>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["WordPress Web Development","AI Automation Engineering","Meta Marketing & Growth","Social Media Management","SME Digitalize Transformation","Post & Creative Design"].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>03 Payment Policy — 50% Advance Required</h2>
        <p style={s.p}>Oxerfy operates on a strict 50% upfront payment policy. No project, task, or service will be initiated until 50% of the agreed total project fee has been received and confirmed.</p>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["All quotes are agreed upon in writing before any payment is requested.","The remaining 50% is due upon project completion before final delivery.","Payments are non-refundable once work has begun.","Oxerfy reserves the right to pause work if the outstanding balance is not settled."].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>04 Project Start & 7-Day Inactivity Policy</h2>
        <h3 style={s.h3}>⚠ Important — Client Action Required After Payment</h3>
        <p style={s.p}>Paying the advance fee alone does not automatically start a project. You must actively provide your project brief within 7 calendar days of payment.</p>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["If no instruction is received within 7 days of payment, the project will be automatically cancelled.","No refund will be issued under this policy.","Extensions are granted solely at Oxerfy's discretion if requested in writing before the 7-day window expires."].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>05 Project Execution & Communication</h2>
        <p style={s.p}>All project work is carried out remotely. Clients are responsible for providing timely feedback, required assets, and approvals.</p>
        <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {["Scope changes after initiation may incur additional charges.","Revisions are limited to the number specified in your service agreement.","Oxerfy communicates via WhatsApp, email, and agreed project tools."].map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>

        <h2 style={s.h2}>06 Intellectual Property</h2>
        <p style={s.p}>Upon receipt of final payment, all deliverables become the property of the client. Until then, all work remains the intellectual property of Oxerfy.</p>
        <p style={s.p}>Oxerfy retains the right to showcase completed work in its portfolio unless the client requests confidentiality in writing.</p>

        <h2 style={s.h2}>07 Limitation of Liability</h2>
        <p style={s.p}>Oxerfy's total liability shall not exceed the total fee paid for the specific service. Oxerfy is not liable for indirect or consequential losses.</p>

        <h2 style={s.h2}>08 Governing Terms</h2>
        <p style={s.p}>These Terms are governed by the laws applicable in Dhaka, Bangladesh. <strong style={{ color: "#F5EEDD" }}>Contact:</strong> oxerfy@gmail.com</p>
      </div>
    </div>
  );
}
