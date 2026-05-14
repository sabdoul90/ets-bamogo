"use client"

import { navItems } from "@/data/navItems"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion";
import { authService } from "@/services/auth.service";


export default function Sidebar() {

    const pathname = usePathname()

    return (
        <motion.nav
            initial={false}
            className="bg-(--sidebar-bg) w-16 md:w-60 pt-7 pl-3 md:pl-6 flex flex-col"
            transition={{ duration: 0.3 }}
        >

            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-7 texte-normal-meduim mb-2.5 text-(--blanc)"
            >
                MENU
            </motion.h1>

            <div className="md:w-36 w-10 h-px bg-(--blanc) mb-5"></div>

            {navItems.map((item, index) => {

                const Icon = item.icon
                const isActive = pathname === item.link

                return (
                    <motion.div
                        key={index}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >

                        <Link
                            href={item.link}
                            className={`flex items-center gap-2.5 py-2
                                ${isActive
                                    ? "navbarActive pl-3.5 md:pl-7"
                                    : "navbarInactive"
                                }`}
                        >

                            <Icon
                                size={22}
                                strokeWidth={1.5}
                                className={isActive ? "text-(--noir)" : "text-(--blanc)"}
                            />

                            <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`hidden md:inline
                                    ${isActive
                                        ? "titre-section-medium text-(--noir)"
                                        : "titre-section-regular text-(--blanc)"
                                    }`}
                            >
                                {item.name}
                            </motion.span>

                        </Link>

                    </motion.div>
                )
            })}

            

            <motion.button
            onClick={()=> {
                authService.logout()
                window.location.href = "/login";
            }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="deconnexion justify-start  md:flex items-center md:justify-center gap-2.5 mt-auto mb-6 mr-3 md:mr-6"
            >

                <LogOut size={22} strokeWidth={1.5} className="text-(--noir)" />

                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden md:inline titre-section-medium text-(--noir)"
                >
                    Deconnexion
                </motion.span>

            </motion.button>

        </motion.nav>
    )
}