"use client";

import { useState } from "react";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from "lucide-react";
import { useWallet } from "@/app/hooks/useWallet";
import { CHAIN_CONFIG } from "@/app/contracts";

export default function NavbarApp() {
  const { address, isConnected, isConnecting, balance, balanceSymbol, connect, disconnect, formatAddress } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                onClick={connect}
                disabled={isConnecting}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>{formatAddress(address!)}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Wallet Info */}
                    <div className="p-4 bg-gradient-to-br from-bg-main to-primary/10 border-b border-gray-200">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                        Connected Wallet
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-text-primary">
                          {formatAddress(address!)}
                        </code>
                      </div>
                      {balance && (
                        <p className="text-sm text-text-secondary mt-2">
                          Balance: {parseFloat(balance).toFixed(4)} {balanceSymbol}
                        </p>
                      )}
                    </div>

                    {/* Network Info */}
                    <div className="px-4 py-2 bg-green-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-700 font-medium">
                          {CHAIN_CONFIG.name}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-2">
                      <button
                        onClick={copyAddress}
                        className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-secondary" />
                        )}
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                      <a
                        href={`${CHAIN_CONFIG.blockExplorer}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <ExternalLink className="w-4 h-4 text-text-secondary" />
                        View on Explorer
                      </a>
                      <button
                        onClick={() => {
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
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
