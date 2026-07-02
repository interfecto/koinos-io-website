import { create } from "zustand"

export const useExchangeStore = create(() => ({
  exchanges: [
    {
      name: "DeFiLlama",
      icon: "/images/exchanges/defillama.svg",
      url: "https://swap.defillama.com/?chain=ethereum&from=0x0000000000000000000000000000000000000000&tab=swap&to=0xa50ad3a559A10f384a5bB2e27516f63E0B937b1A",
      type: "DEX (vKOIN on Ethereum)",
    },
    {
      name: "DeFiLlama",
      icon: "/images/exchanges/defillama.svg",
      url: "https://swap.defillama.com/?chain=base&from=0x0000000000000000000000000000000000000000&tab=swap&to=0x9b61660cb1a6920e9c912570cd210020b956f34e",
      type: "DEX (vKOIN on Base)",
    },
    {
      name: "Jupiter",
      icon: "/images/exchanges/jupiter-logo.png",
      url: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=8AUxdPqYU4FBy5rZDhMJxTniPs7gtEfdHjP3UKM71m6G",
      type: "DEX (Solana)",
    },
    {
      name: "KoinDX",
      icon: "/images/exchanges/koindx-logo.png",
      url: "https://app.koindx.com/swap",
      type: "DEX",
    },
  ],
}))
