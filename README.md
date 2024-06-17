# Equity Researcher Platform

### (IMPORTANT): As of May 30 2024, this repository will only contain text updates made to the application but no longer contain code updates.
This is because I would like to continue to develop and polish this application long-term and may make changes that I do not want others to potentially copy. A monthly log of updates / changes will be maintained at the bottom.

## Purpose
The Stock Research Platform is designed to provide users with a comprehensive and intuitive way to visualize stock information in a hierarchical manner. It allows users to drill down from broad market indices, such as SPY, to sector ETFs like XLK, and further into individual stocks like MSFT. This hierarchical representation aims to simplify the navigation of complex stock data, making it easier for users to conduct in-depth research.

## Technologies Used
- **Database**: Postgres
- **Server**: ExpressJS
- **Client**: Next.js / React
- **Language Model**: Cohere.ai (LLM)

## Getting Started
You can preview the website here: [http://3.142.146.107:3000/](http://3.142.146.107:3000/)

## Key Features
- **Hierarchical Navigation**: Users can drill down from market indices to individual stocks by clicking on drill down stock cards.
- **News Summarization**: Utilizes Cohere.ai to scrape and summarize stock news highlights with citations. Summary updates if last update is greater than 7 days old.
- **Data Coverage**: Contains data on all stocks in the S&P 500.
- **Price Visualization**: Visualizes stock price action over time. Can toggle time period of visualization as well as whether the graph is percent indexed or absolute price based.

## Challenges Faced
- Finding and formatting data sources to seed stock information.
- Implementing lazy load on RAG-based stock summarization to avoid hitting API too many times.
- Setting up hosting on EC2 and automating basic CI/CD for deployment.
- Learning and implementing security measures to protect against SQL injection.
- Acquiring basic DevOps skills to automate CI/CD pipelines.

## Lessons Learned
- Gain proficiency in Next.js and Tailwind CSS for frontend development.
- Understand how to mitigate security risks, such as SQL injection, in database interactions.
- Learn cloud infrastructure management, including instance provisioning and application deployment.
- Implement basic DevOps practices to automate continuous integration and deployment processes.

## Updates & Changes
### June 2024
- Implemented authentication flow using Supabase, allowing users to create accounts and log-in.
- Implemented daily summary metrics at bottom of stock charts, updated daily.

## Screenshots
<img width="1076" alt="image" src="https://github.com/vtamprateep/equity-researcher/assets/19770736/9d9e59e7-3b86-4505-b05b-8a955ba45fac">
<img width="1257" alt="image" src="https://github.com/vtamprateep/equity-researcher/assets/19770736/a0198b3e-5746-49c6-a9a0-3fd91365ee4c">
<img width="1048" alt="image" src="https://github.com/vtamprateep/equity-researcher/assets/19770736/21780d9b-0bce-4ec9-9cee-f918d7554b00">


