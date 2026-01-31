"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";
import { formatUnits } from "viem";

export function useWallet() {
    const { address, isConnected, isConnecting } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });
    const { switchChain, isPending: isSwitching } = useSwitchChain();
    const chainId = useChainId();

    // Check if on correct network
    const isWrongNetwork = isConnected && chainId !== baseSepolia.id;
    const targetChainId = baseSepolia.id;
    const targetChainName = baseSepolia.name;

    const connectWallet = () => {
        connect({
            connector: injected(),
            chainId: baseSepolia.id,
        });
    };

    const switchToBaseSepolia = () => {
        switchChain({ chainId: baseSepolia.id });
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // Format balance from bigint
    const formattedBalance = balance
        ? formatUnits(balance.value, balance.decimals)
        : undefined;

    return {
        address,
        isConnected,
        isConnecting,
        balance: formattedBalance,
        balanceSymbol: balance?.symbol,
        connect: connectWallet,
        disconnect,
        formatAddress,
        // Network detection
        chainId,
        isWrongNetwork,
        isSwitching,
        switchToBaseSepolia,
        targetChainId,
        targetChainName,
    };
}

