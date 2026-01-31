"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  History,
  CheckCircle,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { ADDRESSES, CHAIN_CONFIG, PROTOCOL_CONFIG } from "@/app/contracts";

// Transaction type definition
type TransactionType = "deposit" | "borrow" | "repay" | "withdraw";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  txHash: string;
  blockNumber: bigint;
}

export default function TransactionsPage() {
  const [selectedFilter, setSelectedFilter] = useState<TransactionType | "all">("all");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const fetchTransactions = async () => {
    if (!address || !publicClient) return;

    setLoading(true);
    try {
      // Get logs from a recent range (last ~1000 blocks for efficiency)
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock = currentBlock > 100000n ? currentBlock - 100000n : 0n;

      const [deposits, withdrawals, borrows, repays] = await Promise.all([
        publicClient.getLogs({
          address: ADDRESSES.AuRoomProtocol as `0x${string}`,
          event: {
            type: "event",
            name: "Deposited",
            inputs: [
              { type: "address", name: "user", indexed: true },
              { type: "uint256", name: "amount" },
            ],
          },
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }).catch(() => []),
        publicClient.getLogs({
          address: ADDRESSES.AuRoomProtocol as `0x${string}`,
          event: {
            type: "event",
            name: "Withdrawn",
            inputs: [
              { type: "address", name: "user", indexed: true },
              { type: "uint256", name: "amount" },
            ],
          },
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }).catch(() => []),
        publicClient.getLogs({
          address: ADDRESSES.AuRoomProtocol as `0x${string}`,
          event: {
            type: "event",
            name: "Borrowed",
            inputs: [
              { type: "address", name: "user", indexed: true },
              { type: "uint256", name: "amount" },
            ],
          },
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }).catch(() => []),
        publicClient.getLogs({
          address: ADDRESSES.AuRoomProtocol as `0x${string}`,
          event: {
            type: "event",
            name: "Repaid",
            inputs: [
              { type: "address", name: "user", indexed: true },
              { type: "uint256", name: "amount" },
            ],
          },
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }).catch(() => []),
      ]);

      const allTxs: Transaction[] = [
        ...deposits.map((log, i) => ({
          id: `deposit-${log.transactionHash}-${i}`,
          type: "deposit" as const,
          amount: Number(formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.XAUT_DECIMALS)),
          currency: "XAUT",
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        })),
        ...withdrawals.map((log, i) => ({
          id: `withdraw-${log.transactionHash}-${i}`,
          type: "withdraw" as const,
          amount: Number(formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.XAUT_DECIMALS)),
          currency: "XAUT",
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        })),
        ...borrows.map((log, i) => ({
          id: `borrow-${log.transactionHash}-${i}`,
          type: "borrow" as const,
          amount: Number(formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.IDRX_DECIMALS)),
          currency: "IDRX",
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        })),
        ...repays.map((log, i) => ({
          id: `repay-${log.transactionHash}-${i}`,
          type: "repay" as const,
          amount: Number(formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.IDRX_DECIMALS)),
          currency: "IDRX",
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        })),
      ];

      // Sort by block number (most recent first)
      allTxs.sort((a, b) => Number(b.blockNumber - a.blockNumber));
      setTransactions(allTxs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions();
    }
  }, [address, isConnected]);

  // Filter transactions
  const filteredTransactions =
    selectedFilter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === selectedFilter);

  // Get icon based on transaction type
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="w-5 h-5 text-primary" />;
      case "borrow":
        return <Wallet className="w-5 h-5 text-secondary" />;
      case "repay":
        return <ArrowUpCircle className="w-5 h-5 text-primary" />;
      case "withdraw":
        return <ArrowUpCircle className="w-5 h-5 text-error" />;
    }
  };

  const getTypeBadge = (type: TransactionType) => {
    const styles = {
      deposit: "bg-green-100 text-green-700",
      borrow: "bg-blue-100 text-blue-700",
      repay: "bg-purple-100 text-purple-700",
      withdraw: "bg-orange-100 text-orange-700",
    };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Format transaction hash
  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedTx(expandedTx === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary mb-2">
              Transaction History
            </h1>
            <p className="text-text-secondary">
              View all your deposits, borrows, repayments, and withdrawals
            </p>
          </div>
          {isConnected && (
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
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
              Connect your wallet to view your transaction history.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading transactions...</p>
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-semibold text-text-primary">
                  Filter by Type
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {["all", "deposit", "borrow", "repay", "withdraw"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as TransactionType | "all")}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                      selectedFilter === filter
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
                    }`}
                  >
                    {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-3">
                  No Transactions Found
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  {selectedFilter === "all"
                    ? "You haven't made any transactions yet."
                    : `No ${selectedFilter} transactions found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white rounded-3xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            {getTypeIcon(tx.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              {getTypeBadge(tx.type)}
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">Confirmed</span>
                              </div>
                            </div>
                            <p className="text-sm text-text-secondary">
                              Block #{tx.blockNumber.toString()}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-text-primary">
                              {tx.currency === "XAUT"
                                ? tx.amount.toFixed(4)
                                : tx.amount.toLocaleString()}{" "}
                              {tx.currency}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleExpand(tx.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all flex-shrink-0"
                          >
                            {expandedTx === tx.id ? (
                              <ChevronUp className="w-5 h-5 text-text-secondary" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-text-secondary" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedTx === tx.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                              Transaction Hash
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono text-text-primary">
                                {formatTxHash(tx.txHash)}
                              </code>
                              <a
                                href={`${CHAIN_CONFIG.blockExplorer}/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                              Block Number
                            </p>
                            <p className="text-sm font-semibold text-text-primary">
                              {tx.blockNumber.toString()}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`${CHAIN_CONFIG.blockExplorer}/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Block Explorer
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Summary Stats */}
            {transactions.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="bg-primary/5 rounded-3xl p-6 text-center">
                  <p className="text-sm text-text-secondary mb-2">Total</p>
                  <p className="text-3xl font-bold text-primary">{transactions.length}</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-6 text-center">
                  <p className="text-sm text-text-secondary mb-2">Deposits</p>
                  <p className="text-3xl font-bold text-green-600">
                    {transactions.filter((tx) => tx.type === "deposit").length}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-3xl p-6 text-center">
                  <p className="text-sm text-text-secondary mb-2">Borrows</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {transactions.filter((tx) => tx.type === "borrow").length}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-3xl p-6 text-center">
                  <p className="text-sm text-text-secondary mb-2">Repays</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {transactions.filter((tx) => tx.type === "repay").length}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
