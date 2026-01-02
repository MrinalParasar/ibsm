import Link from "next/link";

const Logo = ({ color = "white", fontSize = "24px" }) => {
    return (
        <div className="logo-text" style={{
            fontSize: fontSize,
            fontWeight: "800",
            color: color,
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "inline-block",
            lineHeight: "1"
        }}>
            IBSM <span style={{ fontWeight: "400" }}>Security</span>
        </div>
    );
};

export default Logo;
