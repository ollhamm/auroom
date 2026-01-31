"use client";

import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { ADDRESSES, ABIS, PROTOCOL_CONFIG } from "@/app/contracts";

// Type for position data returned from contract
interface Position {
    collateralAmount: bigint;
    debtAmount: bigint;
    lastInterestUpdate: bigint;
}

// ============================================
// READ HOOKS
// ============================================

export function usePosition(address?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        functionName: "getPosition",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Cast data to Position type
    const data = result.data as Position | undefined;
    return { ...result, data };
}

export function useHealthFactor(address?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        functionName: "getHealthFactor",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useTotalDebt(address?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        functionName: "getTotalDebt",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useCollateralValue(address?: `0x${string}`) {
    return useReadContract({
        address: ADDRESSES.AuRoomProtocol as `0x${string}`,
        abi: ABIS.AuRoomProtocol,
        functionName: "getCollateralValue",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
}

export function useXautBalance(address?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.MockXAUT as `0x${string}`,
        abi: ABIS.MockXAUT,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useIdrxBalance(address?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.IDRX as `0x${string}`,
        abi: ABIS.IDRX,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useXautPrice() {
    const result = useReadContract({
        address: ADDRESSES.MockPriceOracle as `0x${string}`,
        abi: ABIS.MockPriceOracle,
        functionName: "getPrice",
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useXautAllowance(owner?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.MockXAUT as `0x${string}`,
        abi: ABIS.MockXAUT,
        functionName: "allowance",
        args: owner
            ? [owner, ADDRESSES.AuRoomProtocol as `0x${string}`]
            : undefined,
        query: { enabled: !!owner },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

export function useIdrxAllowance(owner?: `0x${string}`) {
    const result = useReadContract({
        address: ADDRESSES.IDRX as `0x${string}`,
        abi: ABIS.IDRX,
        functionName: "allowance",
        args: owner
            ? [owner, ADDRESSES.AuRoomProtocol as `0x${string}`]
            : undefined,
        query: { enabled: !!owner },
    });
    const data = result.data as bigint | undefined;
    return { ...result, data };
}

// ============================================
// WRITE HOOKS
// ============================================

export function useApproveXaut() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.XAUT_DECIMALS);
        writeContract({
            address: ADDRESSES.MockXAUT as `0x${string}`,
            abi: ABIS.MockXAUT,
            functionName: "approve",
            args: [ADDRESSES.AuRoomProtocol as `0x${string}`, amountWei],
        });
    };

    return { approve, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useApproveIdrx() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.IDRX_DECIMALS);
        writeContract({
            address: ADDRESSES.IDRX as `0x${string}`,
            abi: ABIS.IDRX,
            functionName: "approve",
            args: [ADDRESSES.AuRoomProtocol as `0x${string}`, amountWei],
        });
    };

    return { approve, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useDeposit() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.XAUT_DECIMALS);
        writeContract({
            address: ADDRESSES.AuRoomProtocol as `0x${string}`,
            abi: ABIS.AuRoomProtocol,
            functionName: "deposit",
            args: [amountWei],
        });
    };

    return { deposit, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useBorrow() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const borrow = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.IDRX_DECIMALS);
        writeContract({
            address: ADDRESSES.AuRoomProtocol as `0x${string}`,
            abi: ABIS.AuRoomProtocol,
            functionName: "borrow",
            args: [amountWei],
        });
    };

    return { borrow, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useRepay() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const repay = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.IDRX_DECIMALS);
        writeContract({
            address: ADDRESSES.AuRoomProtocol as `0x${string}`,
            abi: ABIS.AuRoomProtocol,
            functionName: "repay",
            args: [amountWei],
        });
    };

    return { repay, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useWithdraw() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const withdraw = (amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.XAUT_DECIMALS);
        writeContract({
            address: ADDRESSES.AuRoomProtocol as `0x${string}`,
            abi: ABIS.AuRoomProtocol,
            functionName: "withdraw",
            args: [amountWei],
        });
    };

    return { withdraw, hash, isPending, isConfirming, isSuccess, error, reset };
}

// ============================================
// FAUCET HOOKS (for testing)
// ============================================

export function useMintXaut() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const mint = (to: `0x${string}`, amount: string) => {
        const amountWei = parseUnits(amount, PROTOCOL_CONFIG.XAUT_DECIMALS);
        writeContract({
            address: ADDRESSES.MockXAUT as `0x${string}`,
            abi: ABIS.MockXAUT,
            functionName: "mint",
            args: [to, amountWei],
        });
    };

    return { mint, hash, isPending, isConfirming, isSuccess, error, reset };
}
