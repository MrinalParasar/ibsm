import Link from "next/link";

interface LogoProps {
  color?: string;
  fontSize?: string;
}

const Logo = ({ color, fontSize = "24px" }: LogoProps) => {
    return (
        <div
            className="logo-img-wrapper"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}
        >
            <img
                src="/assets/img/logo/brand-logo.png"
                alt="IBSM Logo"
                style={{
                    width: "300px",
                    height: "70px",
                    objectFit: "cover",
                    objectPosition: "center 40%",
                    display: "block"
                }}
            />
        </div>
    );
};

export default Logo;
