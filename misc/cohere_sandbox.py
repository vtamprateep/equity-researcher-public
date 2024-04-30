from dotenv import load_dotenv

import os
import cohere
import json


if __name__ == "__main__":
    load_dotenv("../.secrets")
    COHERE_API_KEY = os.environ.get("COHERE_API_KEY")
    print(COHERE_API_KEY)

    co = cohere.Client(COHERE_API_KEY)
    response = co.chat(
        message="Give me a summary of public news / events within the past week relating to Meta that would influence my decision to buy / sell the stock",
        connectors=[{"id": "web-search"}],
    )

    print(response)

    with open("./sample_output.txt", "w") as fd:
        fd.write(str(response))
