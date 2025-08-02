# Expence-main
Maintaining personal expence of a Person
Personal Expense Tracker
Demo Video

A comprehensive application for tracking personal expenses, managing budgets, and analyzing spending habits.

Table of Contents
Features
Screenshots
Technologies Used
Getting Started
Running the Application
Contributing
License
Features
User authentication (Login and Signup)
Dashboard with financial overview
Detailed spending tracker with sorting and filtering options
Monthly budget setting and management
Custom expense categories
User profile management
Screenshots
Login
Login Secure login interface for existing users

Signup
Signup User-friendly signup process for new account creation

Dashboard
Dashboard Dashboard Comprehensive overview of financial status and recent transactions

Spending Tracker
Spending Tracker Detailed view of expenses with sorting and filtering options

Budget Management
Budget Management Set and track monthly budgets, including rollover from previous months

Categories
Categories Customize and manage expense categories

User Profile
User Profile View and edit user details and preferences

Technologies Used
Backend: Node.js, Express.js
Database: PostgreSQL
Frontend: React.js
Containerization: Docker
Getting Started
Prerequisites
Node.js and npm installed
Docker and Docker Compose installed
PostgreSQL (will be run in a Docker container)
Installation
Clone the repository:

git clone https://github.com/Niket-10/Expense.git
Navigate to the project directory:

cd Expense
Install dependencies:

npm install
Running the Application
Follow these steps to run the Personal Expense Tracker:

Start the PostgreSQL database using Docker:

docker-compose up
Leave this terminal window open.

In a new terminal, navigate to the backend directory and start the server:

cd backend
npm run dev
Ensure PostgreSQL is running and accessible. In a new terminal:

docker exec -it <container_name> psql -U <POSTGRES_USER>
Replace <container_name> with your actual container name (you can press Tab for autocomplete) and <POSTGRES_USER> with the PostgreSQL username specified in your Docker configuration.

Once you've confirmed the database is running, you can exit the PostgreSQL prompt:

\q
In a web browser, navigate to:

http://localhost:3000
You should now see the Personal Expense Tracker application running. Sign up for a new account or log in with existing credentials to start using the app.

Stopping the Application
To stop the backend server, press Ctrl + C in its terminal.
To stop the Docker containers, press Ctrl + C in the terminal where you ran docker-compose up, then run:
docker-compose down
Troubleshooting
If you encounter any issues connecting to the database, ensure that the PostgreSQL container is running:
docker ps
Check the logs of the PostgreSQL container for any error messages:
docker logs <container_name>
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
