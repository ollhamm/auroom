"use client";

import { useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  History,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Transaction type definition
type TransactionType = "deposit" | "borrow" | "repay" | "withdraw";
type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  valueUSD: number;
  timestamp: string;
  txHash: string;
  gasUsed?: number;
  blockNumber?: number;
}

export default function TransactionsPage() {
  const [selectedFilter, setSelectedFilter] = useState<TransactionType | "all">(
    "all",
  );
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  // Mock data - akan diganti dengan real blockchain data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      status: "completed",
      amount: 1.5,
      currency: "XAUT",
      valueUSD: 3000,
      timestamp: "2026-01-28T10:30:00Z",
      txHash:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      gasUsed: 120000,
      blockNumber: 12345678,
    },
    {
      id: "2",
      type: "borrow",
      status: "completed",
      amount: 15000000,
      currency: "IDRX",
      valueUSD: 975,
      timestamp: "2026-01-28T11:15:00Z",
      txHash:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      gasUsed: 180000,
      blockNumber: 12345690,
    },
    {
      id: "3",
      type: "repay",
      status: "completed",
      amount: 5000000,
      currency: "IDRX",
      valueUSD: 325,
      timestamp: "2026-01-27T14:20:00Z",
      txHash:
        "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      gasUsed: 150000,
      blockNumber: 12345600,
    },
    {
      id: "4",
      type: "withdraw",
      status: "completed",
      amount: 0.5,
      currency: "XAUT",
      valueUSD: 1000,
      timestamp: "2026-01-26T09:45:00Z",
      txHash:
        "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      gasUsed: 135000,
      blockNumber: 12345500,
    },
    {
      id: "5",
      type: "deposit",
      status: "pending",
      amount: 0.3,
      currency: "XAUT",
      valueUSD: 600,
      timestamp: "2026-01-28T15:00:00Z",
      txHash:
        "0xpending1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
  ];

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

  // Get status badge
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Completed</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-error/10 text-error rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Failed</span>
          </div>
        );
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Transaction History
        </h1>
        <p className="text-text-secondary">
          View all your deposits, borrows, repayments, and withdrawals
        </p>
      </div>

      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-text-secondary" />
            <span className="text-sm font-semibold text-text-primary">
              Filter by Type
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedFilter === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setSelectedFilter("deposit")}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedFilter === "deposit"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setSelectedFilter("borrow")}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedFilter === "borrow"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Borrows
            </button>
            <button
              onClick={() => setSelectedFilter("repay")}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedFilter === "repay"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Repayments
            </button>
            <button
              onClick={() => setSelectedFilter("withdraw")}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedFilter === "withdraw"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Transactions Found
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {selectedFilter === "all"
                ? "You haven't made any transactions yet. Start by depositing collateral."
                : `No ${selectedFilter} transactions found. Try selecting a different filter.`}
            </p>
            {selectedFilter !== "all" && (
              <button
                onClick={() => setSelectedFilter("all")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
              >
                View All Transactions
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Transaction Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(tx.type)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-text-primary capitalize">
                            {tx.type}
                          </h3>
                          {getStatusBadge(tx.status)}
                        </div>
                        <p className="text-sm text-text-secondary">
                          {formatTimestamp(tx.timestamp)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-text-primary">
                          {tx.type === "borrow" || tx.type === "repay"
                            ? tx.amount.toLocaleString()
                            : tx.amount.toFixed(4)}{" "}
                          {tx.currency}
                        </p>
                        <p className="text-sm text-text-secondary">
                          ≈ ${tx.valueUSD.toLocaleString()} USD
                        </p>
                      </div>

                      {/* Expand Button */}
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

                {/* Expanded Details */}
                {expandedTx === tx.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Transaction Hash */}
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                          Transaction Hash
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-text-primary">
                            {formatTxHash(tx.txHash)}
                          </code>
                          <a
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Block Number */}
                      {tx.blockNumber && (
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                            Block Number
                          </p>
                          <p className="text-sm font-semibold text-text-primary">
                            {tx.blockNumber.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Gas Used */}
                      {tx.gasUsed && (
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                            Gas Used
                          </p>
                          <p className="text-sm font-semibold text-text-primary">
                            {tx.gasUsed.toLocaleString()} gas
                          </p>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                          Date & Time
                        </p>
                        <p className="text-sm font-semibold text-text-primary">
                          {new Date(tx.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* View on Explorer Button */}
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
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
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="bg-primary/5 rounded-3xl p-6 text-center">
              <p className="text-sm text-text-secondary mb-2">
                Total Transactions
              </p>
              <p className="text-3xl font-bold text-primary">
                {filteredTransactions.length}
              </p>
            </div>
            <div className="bg-primary/5 rounded-3xl p-6 text-center">
              <p className="text-sm text-text-secondary mb-2">Completed</p>
              <p className="text-3xl font-bold text-primary">
                {
                  filteredTransactions.filter((tx) => tx.status === "completed")
                    .length
                }
              </p>
            </div>
            <div className="bg-primary/5 rounded-3xl p-6 text-center">
              <p className="text-sm text-text-secondary mb-2">Pending</p>
              <p className="text-3xl font-bold text-secondary">
                {
                  filteredTransactions.filter((tx) => tx.status === "pending")
                    .length
                }
              </p>
            </div>
            <div className="bg-primary/5 rounded-3xl p-6 text-center">
              <p className="text-sm text-text-secondary mb-2">Failed</p>
              <p className="text-3xl font-bold text-error">
                {
                  filteredTransactions.filter((tx) => tx.status === "failed")
                    .length
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
