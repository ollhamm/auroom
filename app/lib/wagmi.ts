import { http, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { CHAIN_CONFIG } from "@/app/contracts";

export const config = createConfig({
    chains: [baseSepolia],
    storage: createStorage({
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
    }),
    transports: {
        [baseSepolia.id]: http(CHAIN_CONFIG.rpcUrl),
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
