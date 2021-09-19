# DiscountGeneratorService
This simple service designed with Node JS, Express and MongoDB

# Installation
Ofcourse you need to install Node JS :)
1. run ==> npm install  (to install all dependencies)

2. Create a .env file with the following details
///////////////////////////////////////////////////
MONGO_URL=mongodb+srv://xtestx:xtestx@cluster0.mlquu.mongodb.net/[YourDatabaseGoesHere]?retryWrites=true&w=majority

ACCESS_TOKEN_SECRET=cf01eaf6b81ec07b572d9ce4ac058ba8d652fc9baa67bba3e86373ad2ae9f5d8c3f980c0de11e4a
1ad1bd98de17b010638730e33513cde65b7049663ab0d1b7e
REFRESH_TOKEN_SECRET=54a675834e1af1b36d64727e2d8a613e74129a93947f1476ff5132b49088f0c28aad67f989b8a6c
4ef086334191a5d9a43dc582ee79d12c46b1cb93805e76f62

TEST_EMAIL=xxxx@gmail.com (please make sure the gmail allows sending from small apps)
TEST_PASS=xxxx
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

3. Create a simple cluster and a database from Atlas MongoDB and replace the connection string with the above
   (https://www.mongodb.com/cloud/atlas/register)  ==> You can also contact me for the test URL I created

4. Start the service ==> npm run devStart

5. Start the Authentication service ==> npm run devStartAuth

# To dos
6. Create a user (Brand or Normal User)
   End Point
   /user

