import Link from "next/link";

interface BreadcrumbProps {
  pageName?: string;
  pageTitle?: string;
}

const Breadcrumb = ({ pageName = "About Company", pageTitle }: BreadcrumbProps) => {
  return (
    <div
      className="breadcrumb-wrapper section-padding"
      style={{ background: 'linear-gradient(180deg, #FFF9E6 0%, #FFFFFF 100%)' }}
    >
      <div className="container">
        <div className="page-heading">
          <h1 className="wow fadeInUp" data-wow-delay=".3s">
            {pageTitle ? pageTitle : pageName}
          </h1>
          <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <i className="fas fa-chevron-right" />
            </li>
            <li className="style-2">{pageName}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Breadcrumb;
