"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="page-nav-wrap mt-5 text-center">
            <ul>
                {/* Previous Button */}
                <li>
                    <button
                        className="page-numbers"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                            background: "none",
                            border: "none",
                            color: currentPage === 1 ? "#999" : "inherit",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer"
                        }}
                    >
                        <i className="fal fa-long-arrow-left" />
                    </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <li key={page}>
                                <button
                                    className={`page-numbers ${currentPage === page ? 'current' : ''}`}
                                    onClick={() => onPageChange(page)}
                                    style={{
                                        background: currentPage === page ? "#ffd966" : "transparent", // Inline fallback/override if CSS fails
                                        border: "none",
                                        color: currentPage === page ? "#000" : "inherit",
                                        cursor: "pointer",
                                        padding: "8px 12px", // Adjust padding to match design if class styles differ
                                    }}
                                >
                                    {page}
                                </button>
                            </li>
                        );
                    } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                    ) {
                        return (
                            <li key={page}>
                                <span className="page-numbers">..</span>
                            </li>
                        );
                    }
                    return null;
                })}

                {/* Next Button */}
                <li>
                    <button
                        className="page-numbers"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            background: "none",
                            border: "none",
                            color: currentPage === totalPages ? "#999" : "inherit",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                        }}
                    >
                        <i className="fal fa-long-arrow-right" />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
