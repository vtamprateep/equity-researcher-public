export {}

declare global {
    interface ChartData {
        symbol: string,
        data: {close_date: string, adj_close: number}[]
    }

    // Server Route Output Types
    interface RouteGetChartsEntry {
        symbol: string;
        close_date: string;
        adj_close: number;
    }

    interface ProfileData {
        symbol: string,
        company_name: string,
        currency: string,
        cik: string,
        isin: string,
        exchange: string,
        cusip: string,
        exchange_short_name: string,
        industry: string,
        website: string,
        description: string,
        ceo: string,
        sector: string,
        country: string,
        phone: string,
        address: string,
        city: string,
        state: string,
        ipo_date: string,
        is_etf: boolean,
        is_actively_trading: boolean,
        is_adr: boolean,
        is_fund: boolean
      }
}