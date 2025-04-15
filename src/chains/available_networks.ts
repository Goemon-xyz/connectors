interface TokenInfo {
    symbol: string;
    address: string;
    decimals: number;
  }
  
  interface NetworkConfig {
    chainId: string;
    tokens: {
      [symbol: string]: TokenInfo;
    };
  }
  
  interface NetworkInfo {
    [networkName: string]: NetworkConfig;
  }
  
  const networks = {
    arbitrum: {
      mainnet: {
        chainId: '42161',
        tokens: {
          ETH: {
            symbol: 'ETH',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            decimals: 18,
          },
          USDC: {
            symbol: 'USDC',
            address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            decimals: 6,
          },
        }
      },
      sepolia: {
        chainId: '421614',
        tokens: {
          ETH: {
            symbol: 'ETH',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            decimals: 18,
          },
        }
      }
    },
    ethereum: {
      mainnet: {
        chainId: '1',
        tokens: {
          ETH: {
            symbol: 'ETH',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            decimals: 18,
          },
          USDC: {
            symbol: 'USDC',
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            decimals: 6,
          },
        }
      }
    }
  } as const;
  
  export namespace AvailableNetworks {
    export interface NetworkDetails {
        [chain: string]: NetworkInfo
    }

    export const availableNetworks: NetworkDetails = networks;
    export type Chain = keyof typeof networks;
  }