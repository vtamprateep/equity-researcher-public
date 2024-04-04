import pathlib
import json
import pandas as pd


def load_consolidate(source_path_list:list[pathlib.Path], function_to_df):
    '''
    Given list of data file paths, loads JSON data, applies function to cast to dataframe, consolidates
    '''
    df_consolidated = pd.DataFrame()

    for path_str in source_path_list:
        if ".txt" not in path_str.name: continue
        # Load data
        path = pathlib.Path(path_str)
        print("Reading", path_str)
        with path.open() as jf: json_data = json.load(jf)

        # Cast to df, rename columns
        df_file = function_to_df(json_data)

        # Merge to one df
        if df_consolidated.empty:
            df_consolidated = df_file
        else:
            df_consolidated = pd.concat([df_file, df_consolidated], ignore_index=True)

    return df_consolidated

def charts_to_df(json_data: dict):
    df = pd.DataFrame(json_data["historical"])
    df["symbol"] = json_data["symbol"]
    return df

def company_profile_to_df(json_data: dict):
    return pd.DataFrame(json_data)

def statements_to_df(json_data: dict):
    return pd.DataFrame(json_data)

if __name__ == "__main__": 
    ###### Clean and format charts data
    source_path = pathlib.Path("../data/raw/charts/")
    dest_path = pathlib.Path("../data/clean/charts/")
    if not dest_path.exists(): dest_path.mkdir(parents=True, exist_ok=True)
    source_path_list = list(source_path.iterdir())

    column_mapper = {
        "adjClose": "adj_close",
        "unadjustedVolume": "unadjusted_volume",
        "changePercent": "change_percent",
        "changeOverTime": "change_over_time",
    }
    df = load_consolidate(source_path_list, charts_to_df)
    df.rename(columns=column_mapper, inplace=True)
    df.to_csv(dest_path.joinpath("charts.csv"), index=False)

    ###### Clean and format company profile
    source_path = pathlib.Path("../data/raw/company_profile/")
    dest_path = pathlib.Path("../data/clean/company_profile/")
    if not dest_path.exists(): dest_path.mkdir(parents=True, exist_ok=True)
    source_path_list = list(source_path.iterdir())
    
    column_mapper = {
            "volAvg": "vol_avg",
            "mktCap": "mkt_cap",
            "lastDiv": "last_div",
            "companyName": "company_name",
            "exchangeShortName": "exchange_short_name",
            "fullTimeEmployees": "full_time_employees",
            "dcfDiff": "dcf_diff",
            "ipoDate": "ipo_date",
            "defaultImage": "default_image",
            "isEtf": "is_etf",
            "isActivelyTrading": "is_actively_trading",
            "isAdr": "is_adr",
            "isFund": "is_fund"
        }
    df = load_consolidate(source_path_list, company_profile_to_df)
    df.rename(columns=column_mapper, inplace=True)
    df.to_csv(dest_path.joinpath("company_profile.csv"), index=False)

    ###### Clean and format balance sheet
    source_path = pathlib.Path("../data/raw/balance_sheet_statement/")
    dest_path = pathlib.Path("../data/clean/balance_sheet_statement/")
    if not dest_path.exists(): dest_path.mkdir(parents=True, exist_ok=True)
    source_path_list = list(source_path.iterdir())
    
    column_mapper = {
        "reportedCurrency": "reported_currency",
        "fillingDate": "filling_date",
        "acceptedDate": "accepted_date",
        "calendarYear": "calendar_year",
        "cashAndCashEquivalents": "cash_and_cash_equivalents",
        "shortTermInvestments": "short_term_investments",
        "cashAndShortTermInvestments": "cash_and_short_term_investments",
        "netReceivables": "net_receivables",
        "otherCurrentAssets": "other_current_assets",
        "totalCurrentAssets": "total_current_assets",
        "propertyPlantEquipmentNet": "property_plant_equipment_net",
        "intangibleAssets": "intangible_assets",
        "goodwillAndIntangibleAssets": "goodwill_and_intangible_assets",
        "longTermInvestments": "long_term_investments",
        "taxAssets": "tax_assets",
        "otherNonCurrentAssets": "other_non_current_assets",
        "totalNonCurrentAssets": "total_non_current_assets",
        "otherAssets": "other_assets",
        "totalAssets": "total_assets",
        "accountPayables": "account_payables",
        "shortTermDebt": "short_term_debt",
        "taxPayables": "tax_payables",
        "deferredRevenue": "deferred_revenue",
        "otherCurrentLiabilities": "other_current_liabilities",
        "totalCurrentLiabilities": "total_current_liabilities",
        "longTermDebt": "long_term_debt",
        "deferredRevenueNonCurrent": "deferred_revenue_non_current",
        "deferredTaxLiabilitiesNonCurrent": "deferred_tax_liabilities_non_current",
        "otherNonCurrentLiabilities": "other_non_current_liabilities",
        "totalNonCurrentLiabilities": "total_non_current_liabilities",
        "otherLiabilities": "other_liabilities",
        "capitalLeaseObligations": "capital_lease_obligations",
        "totalLiabilities": "total_liabilities",
        "preferredStock": "preferred_stock",
        "commonStock": "common_stock",
        "retainedEarnings": "retained_earnings",
        "accumulatedOtherComprehensiveIncomeLoss": "accumulated_other_comprehensive_income_loss",
        "othertotalStockholdersEquity": "othertotal_stockholders_equity",
        "totalStockholdersEquity": "total_stockholders_equity",
        "totalEquity": "total_equity",
        "totalLiabilitiesAndStockholdersEquity": "total_liabilities_and_stockholders_equity",
        "minorityInterest": "minority_interest",
        "totalLiabilitiesAndTotalEquity": "total_liabilities_and_total_equity",
        "totalInvestments": "total_investments",
        "totalDebt": "total_debt",
        "netDebt": "net_debt",
        "finalLink": "final_link"
    }
    df = load_consolidate(source_path_list, statements_to_df)
    df.rename(columns=column_mapper, inplace=True)
    df.to_csv(dest_path.joinpath("balance_sheet_statement.csv"), index=False)

    ###### Clean and format income statement
    source_path = pathlib.Path("../data/raw/income_statement/")
    dest_path = pathlib.Path("../data/clean/income_statement/")
    if not dest_path.exists(): dest_path.mkdir(parents=True, exist_ok=True)
    source_path_list = list(source_path.iterdir())

    column_mapper = {
        "date": "date",
        "symbol": "symbol",
        "reportedCurrency": "reported_currency",
        "cik": "cik",
        "fillingDate": "filling_date",
        "acceptedDate": "accepted_date",
        "calendarYear": "calendar_year",
        "period": "period",
        "revenue": "revenue",
        "costOfRevenue": "cost_of_revenue",
        "grossProfit": "gross_profit",
        "grossProfitRatio": "gross_profit_ratio",
        "researchAndDevelopmentExpenses": "research_and_development_expenses",
        "generalAndAdministrativeExpenses": "general_and_administrative_expenses",
        "sellingAndMarketingExpenses": "selling_and_marketing_expenses",
        "sellingGeneralAndAdministrativeExpenses": "selling_general_and_administrative_expenses",
        "otherExpenses": "other_expenses",
        "operatingExpenses": "operating_expenses",
        "costAndExpenses": "cost_and_expenses",
        "interestIncome": "interest_income",
        "interestExpense": "interest_expense",
        "depreciationAndAmortization": "depreciation_and_amortization",
        "ebitda": "ebitda",
        "ebitdaratio": "ebitda_ratio",
        "operatingIncome": "operating_income",
        "operatingIncomeRatio": "operating_income_ratio",
        "totalOtherIncomeExpensesNet": "total_other_income_expenses_net",
        "incomeBeforeTax": "income_before_tax",
        "incomeBeforeTaxRatio": "income_before_tax_ratio",
        "incomeTaxExpense": "income_tax_expense",
        "netIncome": "net_income",
        "netIncomeRatio": "net_income_ratio",
        "eps": "eps",
        "epsdiluted": "eps_diluted",
        "weightedAverageShsOut": "weighted_average_shs_out",
        "weightedAverageShsOutDil": "weighted_average_shs_out_dil",
        "link": "link",
        "finalLink": "final_link"
    }
    df = load_consolidate(source_path_list, statements_to_df)
    df.rename(columns=column_mapper, inplace=True)
    df.to_csv(dest_path.joinpath("income_statement.csv"), index=False)

    ###### Clean and format cashflow statement
    # source_path = pathlib.Path("../data/raw/cashflow_statement/")
    # dest_path = pathlib.Path("../data/clean/cashflow_statement/")
    # if not dest_path.exists(): dest_path.mkdir(parents=True, exist_ok=True)
    # source_path_list = list(source_path.iterdir())

    # column_mapper = {
    #     "date": "date",
    #     "symbol": "symbol",
    #     "reportedCurrency": "reported_currency",
    #     "cik": "cik",
    #     "fillingDate": "filling_date",
    #     "acceptedDate": "accepted_date",
    #     "calendarYear": "calendar_year",
    #     "period": "period",
    #     "netIncome": "net_income",
    #     "depreciationAndAmortization": "depreciation_and_amortization",
    #     "deferredIncomeTax": "deferred_income_tax",
    #     "stockBasedCompensation": "stock_based_compensation",
    #     "changeInWorkingCapital": "change_in_working_capital",
    #     "accountsReceivables": "accounts_receivables",
    #     "inventory": "inventory",
    #     "accountsPayables": "accounts_payables",
    #     "otherWorkingCapital": "other_working_capital",
    #     "otherNonCashItems": "other_non_cash_items",
    #     "netCashProvidedByOperatingActivities": "net_cash_provided_by_operating_activities",
    #     "investmentsInPropertyPlantAndEquipment": "investments_in_property_plant_and_equipment",
    #     "acquisitionsNet": "acquisitions_net",
    #     "purchasesOfInvestments": "purchases_of_investments",
    #     "salesMaturitiesOfInvestments": "sales_maturities_of_investments",
    #     "otherInvestingActivites": "other_investing_activites",
    #     "netCashUsedForInvestingActivites": "net_cash_used_for_investing_activites",
    #     "debtRepayment": "debt_repayment",
    #     "commonStockIssued": "common_stock_issued",
    #     "commonStockRepurchased": "common_stock_repurchased",
    #     "dividendsPaid": "dividends_paid",
    #     "otherFinancingActivites": "other_financing_activites",
    #     "netCashUsedProvidedByFinancingActivities": "net_cash_used_provided_by_financing_activities",
    #     "effectOfForexChangesOnCash": "effect_of_forex_changes_on_cash",
    #     "netChangeInCash": "net_change_in_cash",
    #     "cashAtEndOfPeriod": "cash_at_end_of_period",
    #     "cashAtBeginningOfPeriod": "cash_at_beginning_of_period",
    #     "operatingCashFlow": "operating_cash_flow",
    #     "capitalExpenditure": "capital_expenditure",
    #     "freeCashFlow": "free_cash_flow",
    #     "link": "link",
    #     "finalLink": "final_link"
    # }
    # df = load_consolidate(source_path_list, statements_to_df)
    # df.rename(columns=column_mapper, inplace=True)
    # df.to_csv(dest_path.joinpath("cashflow_statement.csv"), index=False)
