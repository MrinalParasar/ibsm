import Link from "next/link";

const Logo = ({ color, fontSize = "24px" }) => {
    return (
        <div className="logo-text" style={{
            fontSize: fontSize,
            fontWeight: "800",
            color: color || "white",
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "inline-block",
            lineHeight: "1"
        }}>
            <span style={{ color: "#FAC014" }}>IBSM</span> <span style={{ fontWeight: "400" }}>Security</span>
        </div>
    );
};

export default Logo;
