import { formatUnits, parseUnits } from "viem";
import { PROTOCOL_CONFIG } from "@/app/contracts";

export function formatXaut(amount: bigint | undefined): string {
    if (!amount) return "0";
    return Number(formatUnits(amount, PROTOCOL_CONFIG.XAUT_DECIMALS)).toFixed(4);
}

export function formatIdrx(amount: bigint | undefined): string {
    if (!amount) return "0";
    return Number(
        formatUnits(amount, PROTOCOL_CONFIG.IDRX_DECIMALS)
    ).toLocaleString();
}

export function formatPrice(price: bigint | undefined): string {
    if (!price) return "0";
    return Number(formatUnits(price, PROTOCOL_CONFIG.PRICE_DECIMALS)).toLocaleString();
}

export function formatPriceRaw(price: bigint | undefined): number {
    if (!price) return 0;
    return Number(formatUnits(price, PROTOCOL_CONFIG.PRICE_DECIMALS));
}

export function formatHealthFactor(hf: bigint | undefined): string {
    if (!hf) return "∞";
    if (hf >= BigInt(10) ** BigInt(36)) return "∞"; // Very large = safe
    const value = Number(formatUnits(hf, 18));
    if (value > 100) return "∞";
    return value.toFixed(2);
}

export function formatUsd(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function formatIdr(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function parseXaut(amount: string): bigint {
    return parseUnits(amount || "0", PROTOCOL_CONFIG.XAUT_DECIMALS);
}

export function parseIdrx(amount: string): bigint {
    return parseUnits(amount || "0", PROTOCOL_CONFIG.IDRX_DECIMALS);
}

// Calculate max borrowable IDRX from XAUT collateral
export function calculateMaxBorrow(
    collateralXaut: bigint,
    priceUsd: bigint
): bigint {
    const USD_TO_IDR = 16000n;
    const XAUT_DEC = 10n ** BigInt(PROTOCOL_CONFIG.XAUT_DECIMALS);
    const PRICE_DEC = 10n ** BigInt(PROTOCOL_CONFIG.PRICE_DECIMALS);
    const IDRX_DEC = 10n ** BigInt(PROTOCOL_CONFIG.IDRX_DECIMALS);

    // collateralValue in USD (scaled)
    const collateralValueScaled = collateralXaut * priceUsd;

    // Apply LTV (50%)
    const maxBorrowUsdScaled =
        (collateralValueScaled * BigInt(PROTOCOL_CONFIG.LTV_BPS)) / 10000n;

    // Convert to IDRX (with proper decimal handling)
    // USD * USD_TO_IDR * IDRX_DEC / XAUT_DEC / PRICE_DEC
    const maxBorrowIdrx =
        (maxBorrowUsdScaled * USD_TO_IDR * IDRX_DEC) / XAUT_DEC / PRICE_DEC;

    return maxBorrowIdrx;
}

// Calculate available borrow capacity (max - current debt)
export function calculateAvailableBorrow(
    collateralXaut: bigint,
    priceUsd: bigint,
    currentDebt: bigint
): bigint {
    const maxBorrow = calculateMaxBorrow(collateralXaut, priceUsd);
    if (maxBorrow <= currentDebt) return 0n;
    return maxBorrow - currentDebt;
}

// Calculate how much collateral can be withdrawn while maintaining health
export function calculateWithdrawableCollateral(
    collateralXaut: bigint,
    currentDebt: bigint,
    priceUsd: bigint
): bigint {
    if (currentDebt === 0n) return collateralXaut;

    const USD_TO_IDR = 16000n;
    const XAUT_DEC = 10n ** BigInt(PROTOCOL_CONFIG.XAUT_DECIMALS);
    const PRICE_DEC = 10n ** BigInt(PROTOCOL_CONFIG.PRICE_DECIMALS);
    const IDRX_DEC = 10n ** BigInt(PROTOCOL_CONFIG.IDRX_DECIMALS);

    // Min collateral needed = debt * 10000 / LTV / USD_TO_IDR * XAUT_DEC * PRICE_DEC / IDRX_DEC / price
    // Simplified: debt needs X collateral to maintain LTV
    const minCollateralNeeded =
        (currentDebt * 10000n * XAUT_DEC * PRICE_DEC) /
        BigInt(PROTOCOL_CONFIG.LTV_BPS) /
        USD_TO_IDR /
        IDRX_DEC /
        priceUsd;

    if (collateralXaut <= minCollateralNeeded) return 0n;
    return collateralXaut - minCollateralNeeded;
}

// Format bigint to display string with specified decimals
export function formatBigInt(value: bigint, decimals: number): string {
    return formatUnits(value, decimals);
}
