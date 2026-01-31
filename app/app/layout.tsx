import Sidebar from "../Components/App/Sidebar";
import NavbarApp from "../Components/App/NavbarApp";
import NetworkAlert from "../Components/App/NetworkAlert";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Network Alert Banner */}
      <NetworkAlert />

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

