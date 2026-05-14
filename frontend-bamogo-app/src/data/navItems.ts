import { LayoutGrid, Package, Users, TrendingUp,SquareArrowOutUpRight } from "lucide-react"
import { NavItem } from "@/type/navItem"


export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: LayoutGrid
  },
  {
    name: "Ventes",
    link: "/ventes",
    icon: TrendingUp
  },
  {
    name: "Produits",
    link: "/produits",
    icon: Package
  },
  {
    name: "Clients",
    link: "/clients",
    icon: Users
  },
  {
    name: "Imports",
    link: "/imports",
    icon: SquareArrowOutUpRight
  },
  
]