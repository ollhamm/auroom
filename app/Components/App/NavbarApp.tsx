"use client";

import { useState } from "react";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react";

export default function NavbarApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress] = useState("0x1234...5678"); // Mock wallet address

  const handleConnectWallet = () => {
    // Will integrate with Web3 wallet connection (RainbowKit/wagmi)
    setIsConnected(true);
    console.log("Connect wallet clicked");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsDropdownOpen(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    // Could add toast notification here
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - could add breadcrumbs or page title here */}
          <div className="flex items-center gap-4"></div>

          {/* Right side - Wallet connection */}
          <div className="flex items-center gap-4">
            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>{formatAddress(walletAddress)}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Wallet Info */}
                    <div className="p-4 bg-gradient-to-br from-bg-main to-primary/10 border-b border-gray-200">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                        Connected Wallet
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-text-primary">
                          {formatAddress(walletAddress)}
                        </code>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-2">
                      <button
                        onClick={copyAddress}
                        className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Copy className="w-4 h-4 text-text-secondary" />
                        Copy Address
                      </button>
                      <a
                        href={`https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <ExternalLink className="w-4 h-4 text-text-secondary" />
                        View on Explorer
                      </a>
                      <button
                        onClick={handleDisconnect}
                        className="w-full px-4 py-3 text-left text-sm text-error hover:bg-error/5 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
