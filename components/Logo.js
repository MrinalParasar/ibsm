import Link from "next/link";

const Logo = ({ color, fontSize = "24px" }) => {
    return (
        <div className="logo-img-wrapper" style={{ display: "inline-block" }}>
            <img
                src="/assets/img/logo/brand-logo.png"
                alt="IBSM Logo"
                style={{
                    height: "auto",
                    maxWidth: "180px",
                    display: "block"
                }}
            />
        </div>
    );
};

export default Logo;
