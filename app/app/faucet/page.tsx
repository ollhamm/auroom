"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Droplets,
  Wallet,
  Loader2,
  CheckCircle,
  ExternalLink,
  Coins,
} from "lucide-react";
import { useMintXaut, useXautBalance } from "@/app/hooks/useProtocol";
import { formatXaut } from "@/app/lib/format";
import { CHAIN_CONFIG } from "@/app/contracts";

export default function FaucetPage() {
  const [mintAmount, setMintAmount] = useState("1");
  const { address, isConnected } = useAccount();

  const { data: xautBalance, refetch: refetchBalance } = useXautBalance(address);

  const {
    mint,
    isPending: minting,
    isConfirming: mintConfirming,
    isSuccess: minted,
    hash: mintHash,
    reset: resetMint,
  } = useMintXaut();

  useEffect(() => {
    if (minted) {
      refetchBalance();
      setTimeout(() => {
        resetMint();
      }, 5000);
    }
  }, [minted]);

  const handleMint = () => {
    if (!address) return;
    mint(address, mintAmount);
  };

  const presetAmounts = ["0.1", "0.5", "1", "5"];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Test Token Faucet
        </h1>
        <p className="text-text-secondary">
          Get free test XAUT tokens for development and testing
        </p>
      </div>

      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Connect your wallet to mint test XAUT tokens.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {/* Current Balance */}
            <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Your XAUT Balance</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {formatXaut(xautBalance)} XAUT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mint Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Mint Test XAUT</h3>
                  <p className="text-sm text-text-secondary">Free tokens for testing</p>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Amount to Mint
                </label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setMintAmount(amount)}
                      className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                        mintAmount === amount
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                      }`}
                    >
                      {amount} XAUT
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary text-lg"
                    step="0.1"
                    min="0.01"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-medium">
                    XAUT
                  </span>
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={minting || mintConfirming || !mintAmount || Number(mintAmount) <= 0}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {minting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sign Transaction...
                  </>
                ) : mintConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming...
                  </>
                ) : minted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Minted Successfully!
                  </>
                ) : (
                  <>
                    <Droplets className="w-5 h-5" />
                    Mint {mintAmount} XAUT
                  </>
                )}
              </button>

              {/* Transaction Hash */}
              {mintHash && (
                <div className="mt-4 p-4 bg-green-50 rounded-2xl">
                  <p className="text-sm text-green-700 font-medium mb-2">
                    Transaction {minted ? "confirmed" : "submitted"}!
                  </p>
                  <a
                    href={`${CHAIN_CONFIG.blockExplorer}/tx/${mintHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View on BaseScan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These are test tokens on Base Sepolia testnet.
                They have no real value and are for development purposes only.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
