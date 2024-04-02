from dotenv import load_dotenv
from fmp import FinancialModelingPrepAPI

import os
import datetime
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
    ticker_list = []

    with open("./ticker_list.txt", "r") as ticker_list_file:
        text_lines = ticker_list_file.readlines()
        ticker_list = [x.strip() for x in text_lines]

    # Get 1 year historical charts
    end_date = datetime.date.today()
    start_date = datetime.date(end_date.year - 1, end_date.month, end_date.day)
    

    # Loop through stock list, pull and store data
    for ticker in ticker_list:
        write_dest_path = pathlib.Path(f"../data/charts/{ticker.lower()}_charts.txt")
        data_result = fmp_engine.get_eod_charts_data(ticker, start_date, end_date)
        with open(write_dest_path, "w") as dest_file:
            json.dump(data_result, dest_file)

        time.sleep(0.25)
