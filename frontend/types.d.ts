export {}

declare global {
    interface ChartData {
        labels: string[],
        datasets: {label: string, data: number[]}[]
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