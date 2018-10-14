# MovieBookingExpressApi
Express Api for movie ticket booking

Rest Api made with Express.js and mongoDB for Movie Ticket Booking

# Installation 

git clone git clone https://github.com/christo707/MovieBookingExpressApi.git

cd MovieBookingExpressApi

npm install

npm install --dev

Install and run MongoDB

npm run dev

# Collection Created

1. Screen
{
name: {type: String},
totalSeats: {type: String},
 rows: [{
    name: {type: String},
    seats: [{type: Number}]
  }]
 }
 
 Screens are stored as array of rows
 
 # Saved every row of theatre as array of numbers

0: unreserved

9: unreserved and aisle row

2: booked
 
 # Rest API Developed 
 
 host = http://localhost:9090
 
 1. Add a new Screen - '{{host}}/api/v1/screens' (post)
 
 2. Get all Screens - '{{host}}/api/v1/screens' (get)
 
 3. Get Screen By Name - '{{host}}/api/v1/screens/:screenname' (get)
 
 4. Reserve Seats: '{{host}}/api/v1/screens/:screenname/reserve' (post)

5. Get Available Seats: {{host}}/api/v1/screens/:screenname/available (get)

6. Get information of available tickets at a given position : {{host}}/api/v1/screens/inox/seats?numSeats={x}&choice=                                                 {seat‑row‑and‑number}       (get)

7. Delete Screen: {{host}}/api/v1/screens/:id           (DELETE)



# Assumptions

1. Screen Name is unique    (handled in db)

2. Seats start from 0

3. Aisle Seats is arranged as:    012345              6789

# Future Scope

1. Can implement authentication and social login using passport.js     (I Love Brownie)

2. Can develop UI using angular     (req_time > avail_time)

3. Please consider one more excuse for not hosting on cloud.
 
 
