export default function Footer() {
  return (

    <footer style={{
      marginTop: "80px",
      padding: "40px 20px",
      background: "#05070a",
      borderTop: "1px solid #1a1a1a",
      color: "#9ca3af"
    }}>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center"
      }}>

        {/* BRAND */}
        <h2 style={{
          margin: 0,
          color: "var(--text)",
          fontSize: "22px",
          letterSpacing: "1px"
        }}>
          GS Sports Pune
        </h2>

        {/* TAGLINE */}
        <p style={{
          margin: 0,
          fontSize: "14px",
          opacity: 0.7
        }}>
          For the Love of Football 🌍 | Jerseys | Cleats | Accessories
        </p>

        {/* CONTACT */}
        <div style={{
          marginTop: "10px",
          fontSize: "14px",
          lineHeight: "1.8"
        }}>
          <div>WhatsApp: chat.whatsapp.com/CzVF25PCYEVFqapavlMjgz</div>
          <div>Location: Pune</div>
        </div>

        <div style={{
          marginTop: "10px",
          fontSize: "13px",
          opacity: 0.7
        }}>
          <div>Pan-India Shipping available.</div>
          <div>DM us on Instagram @gssports_punee</div>
        </div>

        {/* DIVIDER */}
        <div style={{
          width: "100%",
          height: "1px",
          background: "#1a1a1a",
          margin: "20px 0"
        }}/>

        {/* COPYRIGHT */}
        <p style={{
          margin: 0,
          fontSize: "13px",
          opacity: 0.6
        }}>
          © {new Date().getFullYear()} Gs Sports Pune. All rights reserved.
        </p>

      </div>

    </footer>
  );
}
