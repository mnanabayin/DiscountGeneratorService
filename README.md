# DiscountGeneratorService
This simple service designed with Node JS, Express and MongoDB

# Installation
Ofcourse you need to install Node JS :)
1. run ==> npm install  (to install all dependencies)

2. Create a .env file with the details in .envExample File
   ( You can generate your secret tokens using node in terminal ==> require('crypto').RandomBytes(64).toString('hex') )

3. Create a simple cluster and a database from Atlas MongoDB and replace the connection string im the .env with the above
   (https://www.mongodb.com/cloud/atlas/register)  ==> You can also contact me for the test URL I created :)

4. Start the service ==> npm run devStart

5. Start the Authentication service ==> npm run devStartAuth

# To dos
6. Create a user (Brand or Normal User)

   End Point
   /user
   
   method POST

   body parameters example

   {
		"firstName":"John",
		"lastName": "Doe",
		"email":"john@test.com",
		"phone": 5553344422,
		"userType": 1
   }


7. 
