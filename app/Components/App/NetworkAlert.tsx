"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useWallet } from "@/app/hooks/useWallet";

export default function NetworkAlert() {
    const { isConnected, isWrongNetwork, isSwitching, switchToBaseSepolia, targetChainName } = useWallet();

    if (!isConnected || !isWrongNetwork) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">
                        Wrong network detected. Please switch to {targetChainName}.
                    </span>
                </div>
                <button
                    onClick={switchToBaseSepolia}
                    disabled={isSwitching}
                    className="bg-white text-red-500 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSwitching ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Switching...
                        </>
                    ) : (
                        `Switch to ${targetChainName}`
                    )}
                </button>
            </div>
        </div>
    );
}
