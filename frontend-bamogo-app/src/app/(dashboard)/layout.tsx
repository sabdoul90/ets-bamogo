"use client"

import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>


    )
}