import { ROUTES } from "./routes"
import { FolderTree, Globe, LayoutDashboard, MessageSquare, ScrollText, Users } from "lucide-react"

export const NAV_LINKS = [
  ROUTES.HOME,
  ROUTES.CATEGORIES,
  ROUTES.RESOURCES,
  ROUTES.ABOUT,
] as const;


export const ADMIN_NAV_LINKS = [
  {
    title: "Головне",
    items: [
      { ...ROUTES.ADMIN.ROOT, icon: LayoutDashboard },
      { ...ROUTES.ADMIN.CATEGORIES, icon: FolderTree },
      { ...ROUTES.ADMIN.RESOURCES, icon: Globe },
      { ...ROUTES.ADMIN.ADMINISTRATORS, icon: Users },
    ],
  },
  {
    title: "Інструменти",
    items: [
      { ...ROUTES.ADMIN.FEEDBACK, icon: MessageSquare },
      { ...ROUTES.ADMIN.LOGS, icon: ScrollText },
    ],
  },
] as const;