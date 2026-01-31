"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardClock,
  DollarSign,
  Droplets,
  Home,
  Hourglass,
  PanelBottomClose,
  WalletCards,
} from "lucide-react";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      href: "/app",
    },
    {
      name: "Deposit",
      icon: <WalletCards className="w-5 h-5" />,
      href: "/app/deposit",
    },
    {
      name: "Borrow",
      icon: <Hourglass className="w-5 h-5" />,
      href: "/app/borrow",
    },
    {
      name: "Repay",
      icon: <DollarSign className="w-5 h-5" />,
      href: "/app/repay",
    },
    {
      name: "Withdraw",
      icon: <PanelBottomClose className="w-5 h-5" />,
      href: "/app/withdraw",
    },
    {
      name: "Transactions",
      icon: <ClipboardClock className="w-5 h-5" />,
      href: "/app/transactions",
    },
    {
      name: "Faucet",
      icon: <Droplets className="w-5 h-5" />,
      href: "/app/faucet",
    },
  ];

  return (
    <aside className="w-64 min-h-screen fixed left-0 top-0 flex flex-col ">
      {/* Logo */}
      <div className="py-18 px-6 flex justify-center items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Auroom</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-6 py-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  activeMenu === item.name
                    ? "bg-primary/10 shadow-sm  font-medium transition-all duration-300"
                    : "text-text-secondary hover:bg-primary/20 hover:shadow-sm font-medium transition-all duration-300"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Version */}
      <div className="p-6 text-sm text-text-secondary">Version V1.0</div>
    </aside>
  );
}
