"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import { hardcodedServices } from "@/lib/data/hardcoded-services";

const ServiceDetailsContent = () => {
    const searchParams = useSearchParams();
    const serviceSlug = searchParams.get('service');
    const [service, setService] = useState<any>(null);

    useEffect(() => {
        if (serviceSlug) {
            const found = hardcodedServices.find(s => s.slug === serviceSlug);
            setService(found || hardcodedServices[0]); // Default to first if not found
        } else {
            setService(hardcodedServices[0]);
        }
    }, [serviceSlug]);

    if (!service) return <div>Loading...</div>;

    return (
        <NextLayout>
            <Breadcrumb pageName={service.title} />
            <section className="service-details-section fix section-padding" style={{ paddingTop: "0px" }}>
                <div className="container">
                    <div className="service-details-wrapper">
                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <div className="service-details-items">
                                    <div className="details-image">
                                        <img src={service.image} alt={service.title} style={{ width: "100%", borderRadius: "12px", marginBottom: "30px" }} />
                                    </div>
                                    <div className="details-content">
                                        <h3>{service.title}</h3>
                                        <p className="mt-3">{service.description}</p>
                                        <div className="mt-4" dangerouslySetInnerHTML={{ __html: service.content }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <div className="main-sidebar">
                                    <div className="single-sidebar-widget">
                                        <div className="wid-title">
                                            <h3>Our Services</h3>
                                        </div>
                                        <div className="widget_categories">
                                            <ul>
                                                {hardcodedServices.map((s) => (
                                                    <li key={s.id}>
                                                        <a href={`/service-details?service=${s.slug}`} className={service.slug === s.slug ? "active" : ""}>
                                                            {s.title} <i className="far fa-arrow-right" />
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </NextLayout>
    );
};

const ServiceDetailsPage = () => {
    return (
        <Suspense fallback={<div className="container py-5">Loading...</div>}>
            <ServiceDetailsContent />
        </Suspense>
    );
};

export default ServiceDetailsPage;
