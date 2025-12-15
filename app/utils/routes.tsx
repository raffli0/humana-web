import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/layouts/MainLayout";
import { Dashboard } from "../components/pages/Dashboard";
import { Employees } from "../components/pages/Employees";
import { Attendance } from "../components/pages/Attendance";
import { Recruitment } from "../components/pages/Recruitment";
import { LeaveRequest } from "../components/pages/LeaveRequest";
import LoginPage from "../auth/login/page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "employees", Component: Employees },
      { path: "attendance", Component: Attendance },
      { path: "recruitment", Component: Recruitment },
      { path: "leave-request", Component: LeaveRequest },
      // { path: "login", Component: LoginPage },
    ],
  },
]);
