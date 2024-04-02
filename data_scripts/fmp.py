from dotenv import load_dotenv

import requests
import datetime


class FinancialModelingPrepAPI:

    def __init__(self, api_key: str):
        self.API_KEY = api_key

    def __send_request(self, url: str, query_params: dict) -> dict[str, any]:
        response = requests.get(url, query_params)
        return response.json()

    def get_eod_charts_data(self, ticker: str, start: datetime.date = None, end: datetime.date = datetime.date.today()) -> dict[str, any]:
        '''
        Charts -> Daily Chart EOD: https://site.financialmodelingprep.com/developer/docs#daily-chart-charts
        Get daily charts data
        '''
        # Set date range & format
        if start == None: start = end
        start.strftime("YYYY-MM-DD"),
        end.strftime("YYYY-MM-DD"),

        # Format request
        url = f"https://financialmodelingprep.com/api/v3/historical-price-full/{ticker}"
        query_params = {
            "from": start,
            "to": end,
            "apikey": self.API_KEY
        }

        return self.__send_request(url, query_params)
    
    def get_balance_sheet_statement_data(self, ticker: str, limit: int = 1):
        '''
        Financial Statements -> Balance Sheet Statement: https://site.financialmodelingprep.com/developer/docs#balance-sheet-statements-financial-statements
        Get balance sheet data
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v3/balance-sheet-statement/{ticker}"
        query_params = {
            "apikey": self.API_KEY,
            "period": "annual"
        }

        return self.__send_request(url, query_params)

    def get_income_statement_data(self, ticker: str, limit: int = 1):
        '''
        Financial Statements -> Income Statement: https://site.financialmodelingprep.com/developer/docs#income-statements-financial-statements
        Get income sheet data
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v3/income-statement/{ticker}"
        query_params = {
            "apikey": self.API_KEY,
            "period": "annual"
        }

        return self.__send_request(url, query_params)

    def get_cashflow_statement_data(self, ticker: str, limit: int = 1):
        '''
        Financial Statements -> Cashflow Statement: https://site.financialmodelingprep.com/developer/docs#cashflow-statements-financial-statements
        Get cashflow statement data
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v3/cash-flow-statement/{ticker}"
        query_params = {
            "apikey": self.API_KEY,
            "period": "annual"
        }

        return self.__send_request(url, query_params)
    
    def get_key_metrics_data(self, ticker: str, limit: int = 1):
        '''
        Statement Analysis -> Key Metrics: https://site.financialmodelingprep.com/developer/docs#key-metrics-statement-analysis
        Get key metrics from statements
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v3/key_metrics/{ticker}"
        query_params = {
            "apikey": self.API_KEY,
            "period": "annual"
        }

        return self.__send_request(url, query_params)
    
    def get_company_profile_data(self, ticker: str):
        '''
        Company Information -> Company Profile: https://site.financialmodelingprep.com/developer/docs#company-profile-company-information
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v3/profile/{ticker}"
        query_params = {
            "apikey": self.API_KEY
        }

        return self.__send_request(url, query_params)
    
    def get_company_peers_data(self, ticker: str):
        '''
        Company Information -> Stock Peers: https://site.financialmodelingprep.com/developer/docs#stock-peers-company-information
        '''
        # Format request
        url = f"https://financialmodelingprep.com/api/v4/stock_peers"
        query_params = {
            "apikey": self.API_KEY,
            "symbol": ticker
        }

        return self.__send_request(url, query_params)


if __name__ == "__main__":
    pass
    # # Load FMP API Key
    # load_dotenv() 
    # FMP_API_KEY = os.getenv("FMP_API_KEY")

    # # Get EOD charts
    # # stock_charts = get_eod_daily_charts_data(FMP_API_KEY, "OSCR")['historical']
