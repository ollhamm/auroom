"use client";

import { useWatchContractEvent } from "wagmi";
import { ADDRESSES, ABIS, PROTOCOL_CONFIG } from "@/app/contracts";
import { useToast } from "@/app/providers/ToastProvider";
import { formatUnits } from "viem";

// Type for logs with args
interface LogWithArgs {
    args: {
        user?: `0x${string}`;
        amount?: bigint;
        collateralSeized?: bigint;
    };
    transactionHash: `0x${string}`;
}

export function useProtocolEvents(userAddress?: `0x${string}`) {
    const toast = useToast();

    // Watch Deposit events
    useWatchContractEvent({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        eventName: "Deposited",
        onLogs(logs) {
            (logs as unknown as LogWithArgs[]).forEach((log) => {
                if (log.args.user?.toLowerCase() === userAddress?.toLowerCase()) {
                    const amount = formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.XAUT_DECIMALS);
                    toast.success(
                        "Deposit Confirmed",
                        `${Number(amount).toFixed(4)} XAUT deposited`
                    );
                }
            });
        },
        enabled: !!userAddress,
    });

    // Watch Borrowed events
    useWatchContractEvent({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        eventName: "Borrowed",
        onLogs(logs) {
            (logs as unknown as LogWithArgs[]).forEach((log) => {
                if (log.args.user?.toLowerCase() === userAddress?.toLowerCase()) {
                    const amount = formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.IDRX_DECIMALS);
                    toast.success(
                        "Borrow Confirmed",
                        `${Number(amount).toLocaleString()} IDRX borrowed`
                    );
                }
            });
        },
        enabled: !!userAddress,
    });

    // Watch Repaid events
    useWatchContractEvent({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        eventName: "Repaid",
        onLogs(logs) {
            (logs as unknown as LogWithArgs[]).forEach((log) => {
                if (log.args.user?.toLowerCase() === userAddress?.toLowerCase()) {
                    const amount = formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.IDRX_DECIMALS);
                    toast.success(
                        "Repayment Confirmed",
                        `${Number(amount).toLocaleString()} IDRX repaid`
                    );
                }
            });
        },
        enabled: !!userAddress,
    });

    // Watch Withdrawn events
    useWatchContractEvent({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        eventName: "Withdrawn",
        onLogs(logs) {
            (logs as unknown as LogWithArgs[]).forEach((log) => {
                if (log.args.user?.toLowerCase() === userAddress?.toLowerCase()) {
                    const amount = formatUnits(log.args.amount || 0n, PROTOCOL_CONFIG.XAUT_DECIMALS);
                    toast.success(
                        "Withdrawal Confirmed",
                        `${Number(amount).toFixed(4)} XAUT withdrawn`
                    );
                }
            });
        },
        enabled: !!userAddress,
    });

    // Watch Liquidated events
    useWatchContractEvent({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        eventName: "Liquidated",
        onLogs(logs) {
            (logs as unknown as LogWithArgs[]).forEach((log) => {
                if (log.args.user?.toLowerCase() === userAddress?.toLowerCase()) {
                    const amount = formatUnits(log.args.collateralSeized || 0n, PROTOCOL_CONFIG.XAUT_DECIMALS);
                    toast.error(
                        "Position Liquidated",
                        `${Number(amount).toFixed(4)} XAUT collateral seized`
                    );
                }
            });
        },
        enabled: !!userAddress,
    });
}

// Component to use in layout
export function ProtocolEventListener({ userAddress }: { userAddress?: `0x${string}` }) {
    useProtocolEvents(userAddress);
    return null;
}
