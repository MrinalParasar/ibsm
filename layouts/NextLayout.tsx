"use client";
import { nextUtility } from "@/utility";
import { Fragment, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface NextLayoutProps {
  header?: number;
  footer?: number;
  children: React.ReactNode;
  bgBlack?: boolean;
  single?: boolean;
}

const NextLayout = ({ header, footer, children, bgBlack, single }: NextLayoutProps) => {
  useEffect(() => {
    console.log(bgBlack);
    if (bgBlack) {
      document.querySelector("body")?.classList.add("home-5-body-color");
    } else {
      if (
        document.querySelector("body")?.classList.contains("home-5-body-color")
      ) {
        document.querySelector("body")?.classList.remove("home-5-body-color");
      }
    }
  }, [bgBlack]);
  useEffect(() => {
    nextUtility.scrollAnimation();
  }, []);

  return (
    <Fragment>
      <Header header={header} single={single} />
      {children}
      <Footer footer={footer} />
    </Fragment>
  );
};
export default NextLayout;

