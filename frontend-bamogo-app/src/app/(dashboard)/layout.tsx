"use client"

import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 min-h-0 overflow-y-auto p-4 bg-(--background)">
                    {children}
                </main>
            </div>
        </div>


    )
}