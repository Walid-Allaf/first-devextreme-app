import { BALANCE, CONSTANTS, CUSTOMIZE, HOME, INVOICE, REPORTS, TASKS } from "./assets";

export const navigation = [
  {
    text: "الرئيسية",
    path: "/home",
    icon: HOME,
  },
  {
    text: "المهام",
    path: "/tasks",
    icon: TASKS,
  },
  {
    text: "فواتير",
    path: "/invoice",
    icon: INVOICE,
  },
  {
    text: "ثوابت",
    path: "/constants",
    icon: CONSTANTS,
  },
  {
    text: "قيود",
    path: "/balance",
    icon: BALANCE,
  },
  {
    text: "تخصيص",
    path: "/customize",
    icon: CUSTOMIZE,
  },
  {
    text: "تقارير",
    path: "/reports",
    icon: REPORTS,
  },
  // {
  //   text: "Examples",
  //   icon: "folder",
  //   items: [
  //     {
  //       text: "Profile",
  //       path: "/profile",
  //     },
  //     {
  //       text: "Tasks",
  //       path: "/tasks",
  //     },
  //   ],
  // },
];
