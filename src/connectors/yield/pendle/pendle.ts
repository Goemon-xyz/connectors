import axios, { AxiosInstance } from 'axios';
import { PendleConfig } from './pendle.config';

interface Market {
  [key: string]: any;
}

interface MarketsResponse {
    markets: Market[];
}

interface SwapInputTokens {
  [key: string]: any;
}

interface PendleSwapResponse {
  [key: string]: any;
}

interface PendleRollOverPtResponse {
  [key: string]: any;
}

interface MarketRates {
  [key: string]: any;
}

interface MarketTokens {
  [key: string]: any;
}

export class PendleSdk {
  private readonly baseUrl: string = PendleConfig.config.baseURL;
  private readonly client: AxiosInstance;
  private chainId: string;

  /**
   * Initialize Pendle SDK
   * @param chainId The blockchain chain ID to use for API calls
   */
  constructor(chainId: string) {
    this.chainId = chainId;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        return Promise.reject(new Error(`Pendle API error: ${errorMsg}`));
      }
    );
  }

  /**
   * Fetches all active markets from Pendle API
   * @param limit Number of results per page
   * @param isActive Filter for active markets
   * @returns Promise resolving to array of Market objects
   */
  async fetchAllActiveMarkets(limit: number, isActive: boolean): Promise<Market[]> {
    let allMarkets: Market[] = [];
    let skip = 0;
    
    while (true) {
      const { data } = await this.client.get<MarketsResponse>(
        `/core/v1/${this.chainId}/markets`, {
          params: {
            limit,
            skip,
            select: 'pro',
            is_active: isActive
          }
        }
      );
      
      if (!data.markets || data.markets.length === 0) {
        break; // Exit loop if no more results
      }
      
      allMarkets = [...allMarkets, ...data.markets];
      skip += limit; // Increment skip by limit to fetch next set of records
    }
    
    return allMarkets;
  }

  /**
   * Fetches the input tokens mapped to a given market
   * @param marketAddr Market address
   * @returns Promise resolving to array of SwapInputTokens
   */
  async fetchSwapInputTokens(marketAddr: string): Promise<SwapInputTokens[]> {
    const { data } = await this.client.get<SwapInputTokens[]>(
      `/sdk/api/v1/rawTokens`, {
        params: {
          chainId: this.chainId,
          marketAddr,
          tokenType: 'swapExactInInputTokens'
        }
      }
    );
    
    return data;
  }

  /**
   * Fetches the calldata required to mint SY from a token
   * @param params Parameters for the API call
   * @returns Promise resolving to PendleSwapResponse
   */
  async getMintSyFromTokenCalldata(params: Record<string, string>): Promise<PendleSwapResponse> {
    const { data } = await this.client.get<PendleSwapResponse>(
      `/sdk/api/v1/mintSyFromToken`, {
        params
      }
    );
    
    return data;
  }

  /**
   * Fetches the calldata required to swap a token for PT
   * @param params Parameters for the API call
   * @returns Promise resolving to PendleSwapResponse
   */
  async getSwapExactTokenForPtCalldata(params: Record<string, string>): Promise<PendleSwapResponse> {
    const { data } = await this.client.get<PendleSwapResponse>(
      `/sdk/api/v1/swapExactTokenForPt`, {
        params
      }
    );
    
    return data;
  }

  /**
   * Fetches the calldata required to roll over PT
   * @param params Parameters for the API call
   * @returns Promise resolving to PendleRollOverPtResponse
   */
  async getRollOverPtCalldata(params: Record<string, string>): Promise<PendleRollOverPtResponse> {
    const { data } = await this.client.get<PendleRollOverPtResponse>(
      `/sdk/api/v1/rollOverPt`, {
        params
      }
    );
    
    return data;
  }

  /**
   * Fetches the calldata required to swap PT for a token
   * @param params Parameters for the API call
   * @returns Promise resolving to PendleSwapResponse
   */
  async getSwapExactPtForTokenCalldata(params: Record<string, string>): Promise<PendleSwapResponse> {
    const { data } = await this.client.get<PendleSwapResponse>(
      `/sdk/api/v1/swapExactPtForToken`, {
        params
      }
    );
    
    return data;
  }

  /**
   * Fetches the current rates for a specific market
   * @param marketAddress Market address
   * @returns Promise resolving to MarketRates
   */
  async getMarketRates(marketAddress: string): Promise<MarketRates> {
    const { data } = await this.client.get<MarketRates>(
      `/core/v1/sdk/${this.chainId}/markets/${marketAddress}/swapping-prices`
    );
    
    return data;
  }

  /**
   * Fetches the current prices of LP in USD
   * @param addresses Array of addresses
   * @returns Promise resolving to a map of address to price
   */
  async getAssetLPPrices(addresses: string[]): Promise<Record<string, number>> {
    const { data } = await this.client.get<{ prices: Record<string, number> }>(
      `/core/v1/${this.chainId}/assets/prices`, {
        params: {
          addresses: addresses.join(',')
        }
      }
    );
    
    return data.prices;
  }

  /**
   * Fetches detailed market data for a specific market address
   * @param marketAddress Market address
   * @returns Promise resolving to Market
   */
  async getMarketData(marketAddress: string): Promise<Market> {
    const { data } = await this.client.get<Market>(
      `/core/v1/${this.chainId}/markets/${marketAddress}`, {
        params: {
          limit: 100,
          select: 'pro',
          is_active: true
        }
      }
    );
    
    return data;
  }

  /**
   * Fetches all active markets from the Pendle API
   * @returns Promise resolving to array of ActiveMarket objects
   */
  async getActiveMarkets(): Promise<Market[]> {
    const { data } = await this.client.get<MarketsResponse>(
      `/core/v1/${this.chainId}/markets/active`
    );
    
    return data.markets;
  }

  /**
   * Fetches the available tokens for a specific market
   * @param marketAddress Market address
   * @returns Promise resolving to MarketTokens
   */
  async getMarketTokens(marketAddress: string): Promise<MarketTokens> {
    const { data } = await this.client.get<MarketTokens>(
      `/core/v1/sdk/${this.chainId}/markets/${marketAddress}/tokens`
    );
    
    return data;
  }

  /**
   * Set a new chain ID for subsequent API calls
   * @param chainId The new blockchain chain ID to use
   */
  setChainId(chainId: string): void {
    this.chainId = chainId;
  }

  /**
   * Get the current chain ID being used
   * @returns The current chain ID
   */
  getChainId(): string {
    return this.chainId;
  }
}