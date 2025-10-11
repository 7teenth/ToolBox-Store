import React from "react";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";

export const AdminPageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
};
