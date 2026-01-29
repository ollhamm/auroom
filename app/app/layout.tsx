import Sidebar from "../Components/App/Sidebar";
import NavbarApp from "../Components/App/NavbarApp";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto ml-64">
        {/* Navbar */}
        <NavbarApp />

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
