# Marketplace Project

The Marketplace project is a comprehensive online platform designed to facilitate the buying and selling of various items. The platform aims to provide users with a seamless and user-friendly experience, allowing them to browse, search, and purchase items with ease.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Database Setup](#database-setup)
7. [License](#license)

## Introduction

The Marketplace project is built to create an efficient and user-friendly online marketplace. By leveraging modern web technologies, the platform offers users the ability to browse, search, and purchase items easily. The project focuses on providing a responsive design and secure environment for transactions.

## Features

- **User Authentication**: Secure login and registration system to protect user data.
- **Item Listings**: Detailed item listings with images, descriptions, prices, and categories.
- **Search and Filter**: Advanced search functionality and category filters to help users find specific items quickly.
- **Shopping Cart**: An intuitive shopping cart system where users can add, remove, and manage items before making a purchase.
- **Responsive Design**: Ensures the platform is accessible and functional across various devices and screen sizes.
- **Dark Mode**: Supports both light and dark modes for better user experience in different lighting conditions.

## Technologies Used

- **JavaScript**: 70.4%
- **CSS**: 28%
- **HTML**: 1.6%
- **MySQL**: Used for database management

## Installation

To get a local copy up and running, follow these simple steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pacho-hash/Marketplace.git

*Navigate to the project directory*
   ```bash
   cd Marketplace
  ```
*Install dependencies*
```bash
npm install
```
## Database Setup
**Install MySQL:**
Follow the instructions on the [MySQL website](https://dev.mysql.com/downloads/) to download and install MySQL on your machine.

**Create a database:**
Open your MySQL command line tool and run the following command to create a new database:
```bash

CREATE DATABASE marketplace_db;
```
**Create a .env file in the root directory of the project and add your database credentials:**

env
```bash

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=marketplace_db
```

**Run migrations:**
Use a migration tool like Sequelize to run migrations and set up the database schema. If using Sequelize, run:
```bash

npx sequelize-cli db:migrate
```
## **Usage**
To start the development server, run:
```bash
npm start
```
Open http://localhost:3000 to view it in your browser. The page will reload when you make changes.

To build the app for production, run:
```bash
npm run build
```

## License
Distributed under the MIT License
