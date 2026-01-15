"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
    isSidebarCollapsed: boolean;
    setSidebarCollapsed: (value: boolean) => void;
    toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    return (
        <AdminContext.Provider
            value={{
                isSidebarCollapsed,
                setSidebarCollapsed,
                toggleSidebar,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
