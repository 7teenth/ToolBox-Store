// pages/admin/_admin.tsx
import React from "react";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";

const AdminPage: React.FC = () => {
  return (
    <AdminAuthWrapper>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        {/* Тут можно добавлять контент админки */}
        <p>Welcome to the admin panel!</p>
      </div>
    </AdminAuthWrapper>
  );
};

export default AdminPage;
