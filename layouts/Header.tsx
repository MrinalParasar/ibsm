"use client";
import { nextUtility } from "@/utility";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Logo from "../components/Logo";
import BlogMegaMenu from "../components/BlogMegaMenu";

interface HeaderProps {
  header?: number;
  single?: boolean;
}

interface MenuItem {
  id: number;
  href: string;
  title: string;
}

interface MenuProps {
  single?: boolean;
  menu?: MenuItem[];
}

interface MobileMenuProps {
  single?: boolean;
  menu?: MenuItem[];
}

interface SidebarProps {
  sidebarToggle: boolean;
  close: () => void;
  menu?: MenuItem[];
  single?: boolean;
}

interface Header1Props {
  single?: boolean;
  menu?: MenuItem[];
}

const Header = ({ header, single }: HeaderProps) => {
  useEffect(() => {
    nextUtility.stickyNav();
  }, []);

  return <Header1 single={single} />;
};
export default Header;

const Menu = ({ single, menu }: MenuProps) => {
  const singleMenu: MenuItem[] = menu
    ? menu
    : [
      { id: 1, href: "about", title: "About" },
      { id: 2, href: "services", title: "Services" },
      { id: 3, href: "team", title: "Team" },
      { id: 4, href: "blog", title: "Blog" },
    ];
  return (
    <Fragment>
      {single ? (
        <nav id="mobile-menu" className="d-none d-xl-block">
          <ul>
            <li className="active menu-thumb">
              <Link href="/">Home</Link>
            </li>
            <li className="active d-xl-none">
              <Link href="/" className="border-none">
                Home
              </Link>
            </li>
            {singleMenu.map((menu) => (
              <li key={menu.id}>
                <a href={`#${menu.href}`}>{menu.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <nav id="mobile-menu" className="d-none d-xl-block">
          <ul>
            <li className="has-dropdown active menu-thumb">
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="about">About</Link>
            </li>
            <li className="has-dropdown">
              <Link href="news">
                Blog
                <i className="fas fa-angle-down" />
              </Link>
              <div className="submenu blog-mega-wrapper">
                <BlogMegaMenu />
              </div>
            </li>
            <li>
              <Link href="careers">Careers</Link>
            </li>
          </ul>
        </nav>
      )}
    </Fragment>
  );
};

const MobileMenu = ({ single, menu }: MobileMenuProps) => {
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [multiMenu, setMultiMenu] = useState<string>("");
  const activeMenuSet = (value: string) =>
    setActiveMenu(activeMenu === value ? "" : value);
  const activeLi = (value: string): React.CSSProperties =>
    value === activeMenu ? { display: "block" } : { display: "none" };
  const multiMenuSet = (value: string) =>
    setMultiMenu(multiMenu === value ? "" : value);
  const multiMenuActiveLi = (value: string): React.CSSProperties =>
    value === multiMenu ? { display: "block" } : { display: "none" };
  const singleMenu: MenuItem[] = menu
    ? menu
    : [
      { id: 1, href: "about", title: "About" },
      { id: 2, href: "services", title: "Services" },
      { id: 3, href: "team", title: "Team" },
      { id: 4, href: "blog", title: "Blog" },
    ];
  return (
    <div className="mobile-menu fix mb-3 mean-container d-block d-xl-none">
      <div className="mean-bar">
        <a href="#nav" className="meanmenu-reveal">
          <span>
            <span>
              <span />
            </span>
          </span>
        </a>
        <nav className="mean-nav">
          <ul>
            <li className="active d-xl-none">
              <Link href="/" className="border-none">
                Home
              </Link>
            </li>
            {single ? (
              <Fragment>
                {singleMenu.map((menu) => (
                  <li key={menu.id}>
                    <a href={`#${menu.href}`}>{menu.title}</a>
                  </li>
                ))}
              </Fragment>
            ) : (
              <Fragment>
                <li>
                  <Link href="about">About</Link>
                </li>
                <li className="has-dropdown">
                  <a href="#" onClick={() => activeMenuSet("Blog")}>
                    Blog
                    <i className="fas fa-angle-down" />
                  </a>
                  <ul className="submenu" style={activeLi("Blog")}>
                    <li>
                      <Link href="news">Blog</Link>
                    </li>
                    <li>
                      <Link href="news-details">Blog Details</Link>
                    </li>
                  </ul>
                  <a
                    className="mean-expand"
                    href="#"
                    onClick={() => activeMenuSet("Blog")}
                  >
                    <i className="far fa-plus" />
                  </a>
                </li>
                <li>
                  <Link href="careers">Careers</Link>
                </li>
              </Fragment>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarToggle, close, menu, single }: SidebarProps) => {
  return (
    <Fragment>
      <div className="fix-area">
        <div className={`offcanvas__info ${sidebarToggle ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <Logo color="black" />
                  </Link>
                </div>
                <div className="offcanvas__close" onClick={() => close()}>
                  <button>
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix mb-3">
                <MobileMenu single={single} menu={menu} />
              </div>
              <p className="text d-none d-xl-block mb-5">
                Nullam dignissim, ante scelerisque the is euismod fermentum odio
                sem semper the is erat, a feugiat leo urna eget eros. Duis
                Aenean a imperdiet risus.
              </p>
              <div className="offcanvas__contact">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fal fa-map-marker-alt" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#" rel="noopener noreferrer">
                        Shop no.2 B-73 shalimar Garden extn.-1 Sahibabad,
                        Ghaziabad, U.P. 201005
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="mailto:info@ibrainstormmedia.com">
                        info@ibrainstormmedia.com
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-clock" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#" rel="noopener noreferrer">
                        Mon-Sat, 09am - 06pm
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="tel:8512036470">+91 8512036470</a>
                    </div>
                  </li>
                </ul>

                <div className="social-icon d-flex align-items-center">
                  <a href="#">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter" />
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube" />
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${sidebarToggle ? "overlay-open" : ""}`}
        onClick={() => close()}
      />
    </Fragment>
  );
};

const Header1 = ({ single, menu }: Header1Props) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    <Fragment>
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div
                className="sticky-logo"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link href="/">
                  <div className="logo-1">
                    <Logo color="white" />
                  </div>
                </Link>
                <Link href="/">
                  <div className="logo-2">
                    <Logo color="#000" />
                  </div>
                </Link>
              </div>
              <div className="header-left">
                <div className="mean__menu-wrapper">
                  <div className="main-menu">
                    <Menu single={single} />
                  </div>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="header__hamburger d-xl-block my-auto">
                  <div
                    className="sidebar__toggle"
                    onClick={() => setSidebarToggle(true)}
                  >
                    <i className="far fa-bars" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Sidebar
        sidebarToggle={sidebarToggle}
        close={() => setSidebarToggle(false)}
        single={single}
      />
    </Fragment>
  );
};

