# Equity Researcher Platform

## Purpose
The Stock Research Platform is designed to provide users with a comprehensive and intuitive way to visualize stock information in a hierarchical manner. It allows users to drill down from broad market indices, such as SPY, to sector ETFs like XLK, and further into individual stocks like MSFT. This hierarchical representation aims to simplify the navigation of complex stock data, making it easier for users to conduct in-depth research.

## Technologies Used
- **Database**: Postgres
- **Server**: ExpressJS
- **Client**: Next.js / React
- **Language Model**: Cohere.ai (LLM)

## Getting Started
You can preview the website here: http://3.14.6.185:3000/

## Key Features
- **Hierarchical Navigation**: Users can drill down from market indices to individual stocks.
- **News Summarization**: Utilizes Cohere.ai to scrape and summarize stock news highlights with citations.
- **Data Coverage**: Contains data on all stocks in the S&P 500.
- **Price Visualization**: Visualizes stock price action over time.

## Challenges Faced
- Finding and formatting data sources to seed stock information.
- Setting up hosting on EC2 and automating basic CI/CD for deployment.
- Learning and implementing security measures to protect against SQL injection.
- Acquiring basic DevOps skills to automate CI/CD pipelines.

## Lessons Learned
- Gain proficiency in Next.js and Tailwind CSS for frontend development.
- Understand how to mitigate security risks, such as SQL injection, in database interactions.
- Learn cloud infrastructure management, including instance provisioning and application deployment.
- Implement basic DevOps practices to automate continuous integration and deployment processes.

## Future Plans
- Incorporate analyst insights to enrich stock research capabilities.
- Integrate data sources for updating the database with daily stock prices.
- Schedule jobs to refresh weekly summarized insights and citations.
- Enhance stock price visualization by indexing to percent gain.

## Screenshots
![image](https://github.com/vtamprateep/value-investing-research-platform/assets/19770736/03218ef2-f4bc-4b26-8ef1-695f475536cf)
![Screenshot 2024-05-10 at 4 01 45 PM](https://github.com/vtamprateep/value-investing-research-platform/assets/19770736/0149462d-7b22-4f47-b82c-c4749abbdcd2)

