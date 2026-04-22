import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
