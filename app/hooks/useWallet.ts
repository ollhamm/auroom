"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";

export function useWallet() {
    const { address, isConnected, isConnecting } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });

    const connectWallet = () => {
        connect({
            connector: injected(),
            chainId: baseSepolia.id,
        });
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return {
        address,
        isConnected,
        isConnecting,
        balance: balance?.formatted,
        balanceSymbol: balance?.symbol,
        connect: connectWallet,
        disconnect,
        formatAddress,
    };
}
