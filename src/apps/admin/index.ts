import { BaseApp } from "../base/types";
import { AdminAppComponent } from "./components/AdminAppComponent";

export const helpItems = [
  {
    icon: "👑",
    title: "Admin Access",
    description: "This app is only accessible to the admin user (kassam).",
  },
  {
    icon: "👥",
    title: "User Management",
    description: "View, search, and manage registered users.",
  },
  {
    icon: "💬",
    title: "Room Management",
    description: "View and manage chat rooms, delete inappropriate content.",
  },
  {
    icon: "📊",
    title: "Statistics",
    description: "View system statistics and usage metrics.",
  },
];

export const appMetadata = {
  name: "Admin",
  version: "1.0",
  creator: {
    name: "Kassam Khoja",
  },
  github: "https://github.com/kassamkhoja/lexi",
  icon: "/icons/default/mac-classic.png",
};

export const AdminApp: BaseApp = {
  id: "admin",
  name: "Admin",
  icon: { type: "image", src: appMetadata.icon },
  description: "System administration panel",
  component: AdminAppComponent,
  helpItems,
  metadata: appMetadata,
};
