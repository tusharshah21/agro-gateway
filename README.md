
# Ufarm Market

An eCommerce web app that provides functionality for customers to browse and purchase products, add items to a shopping cart, and checkout using a secure payment gateway.


## Installation

Ensure Node is installed.

Fork or Clone the project.
```bash
$ git clone https://github.com/TrippleA-Ashaba/node_ufarm_project.git
```

#### Install dependencies

```bash
$ cd <project>
$ npm Install
```

#### Edit Environment Variables

```
.env file

PORT = 3000
DB_URI = <your_mongodb_url> or mongodb://127.0.0.1:27017/<dbname> 
SESSION_SECRET = 'Your secret key'
```


    
## Usage

Start Server

```bash
$ npm run dev
```

Visit http://localhost:4000/

Sign up then login to browse dashboard.

To Add Agricultural Officer, visit http://localhost:4000/ao/agricosignup

Agricultural Officer adds Farmer One(FO), Farmer One adds Urban Farmer(UF) who in turn uploads produce for sell.

For produce to appear at the market center, they'll have to be approved by the FO first.

## Demo

https://github.com/TrippleA-Ashaba/node_ufarm_project/blob/main/public/docs/ufarm.pdf

