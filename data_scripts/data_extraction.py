from dotenv import load_dotenv
from fmp import FinancialModelingPrepAPI

import os
import json
import pathlib
import time


def write_data_to_file(dest_path: pathlib.Path, data: dict[str, any]):
    json.dump(data, dest_path)

###### Must run from data_scripts directory

if __name__ == "__main__":
    # Load FMP API Key and stock list
    load_dotenv() 
    FMP_API_KEY = os.getenv("FMP_API_KEY")
    fmp_engine = FinancialModelingPrepAPI(FMP_API_KEY)
    ticker_list = ["TSLA", "GOOGL", "OSCR", "MSFT", "SPY", "AMZN", "META", "NVDA", "AAPL", "IWM"]

    ###### Get 1 year historical charts
    end_date = datetime.date.today()
    start_date = datetime.date(end_date.year - 1, end_date.month, end_date.day)
    
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/raw/charts/{ticker.lower()}_charts.txt")
        data_result = fmp_engine.get_eod_charts_data(ticker, start_date, end_date)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)

    ###### Get latest annual financial statement data
    # Balance sheet statement
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/raw/balance_sheet_statement/{ticker.lower()}_balance_sheet.txt")
        data_result = fmp_engine.get_balance_sheet_statement_data(ticker)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)

    # Cashflow statement
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/raw/cashflow_statement/{ticker.lower()}_cashflow.txt")
        data_result = fmp_engine.get_cashflow_statement_data(ticker)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)

    # Income statement
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/raw/income_statement/{ticker.lower()}_income.txt")
        data_result = fmp_engine.get_income_statement_data(ticker)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)

    ###### Company profile
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/raw/company_profile/{ticker.lower()}_profile.txt")
        data_result = fmp_engine.get_company_profile_data(ticker)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)
    