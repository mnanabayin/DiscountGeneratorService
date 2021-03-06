# DiscountGeneratorService
This simple service designed with Node JS, Express, MongoDB & Mongoose, JWT authentication and CouponJS.
There is also an email sender using nodemailer.

# Database design
  Generated_Discount       fields ==> brandUserId,discountCode,createdAt,updatedAt

  User                     fields ==> firstName,lastName,email,phone,userType,createdAt,updatedAt

  User_Taken_Codes         fields ==> userID, brandUserID, codeID, createdAt, updatedAt 

  By default MongoDB generates a unique Object_id for all records


# Installation
Ofcourse you need to install Node JS :)
1. run ==> npm install  (to install all dependencies)

2. Create a .env file with the details in .envExample File
   ( You can generate your secret tokens using node in terminal ==> require('crypto').RandomBytes(64).toString('hex') )

3. Create a simple cluster and a database from Atlas MongoDB and replace the connection string im the .env with the above
   (https://www.mongodb.com/cloud/atlas/register)  ==> You can also contact me for the test URL I created :)

4. Start the service ==> npm run devStart

5. Start the Authentication service ==> npm run devStartAuth

# To dos or End points to play around with

6. Create a user (Brand or Normal User)

   End Point

   POST   localhost:5050/user

   body parameters example

   {
		"firstName":"John",
		"lastName": "Doe",
		"email":"john@test.com",
		"phone": 5553344422,
		"userType": 1
   }


7. View all users 

   Endpoint 

   GET   localhost:5050/users


8.  Get a single user 
    End point 

    GET localhost:5050/users/:uid
 

 9. Generate Discount Codes by brand
    
    End point
    
    POST localhost:5050/discount/generatecodes

    request body 

    {
        "brandUserId":"61460b23c6c36323c55be81d",
        "length":9,
        "numberOfCoupons":5
    }


    It is required to login to get an authentication token that lastS for 10m according to the settings.
    Use an email used for a created user in request body

    POST localhost:4000/user/login/

    request body 

    {
      "email":"xxxxx@gmail.com"
    } 
   

   10. Get all codes generated by brand user. You can remove the authentication middleware (authenticateToken) for test purposes, or get a Bearer token as decribed in point 9.
       
       GET localhost:5050/discount/codes

        request body 

        {
		    "brandUserId":"61460b23c6c36323c55be81d"
        }
   

   11. Fetch discount code by a particular brand from a normal user. You can get a Bearer authentication token as described in point 9. 

        GET localhost:5050/discount/fetchcode

        request body 

        {
            "brandUserId":"61460b23c6c36323c55be81d",
            "UserId":"6145df9d1e54eb68d603a286"
        }
        
   
        Note that an email is sent to the brand user whenever a Fetch is done. You can set up with a simple gmail for test purposes. The email credentials are found in the .env file

