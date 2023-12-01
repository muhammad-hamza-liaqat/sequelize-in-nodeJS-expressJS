# sequelize-in-nodeJS-expressJShttp://localhost:3000/details/customer/:customerNumber

this functionality of this project is to fetch the data from the order table in the database using sequelize ORM in nodeJS and expressJS. 
the schema of DB is made under the models folder.
the routes are made in routes folder
the controller has the main business logic of the project
the DB connection is placed under the database folder

uploads folder will store the query generated and will be saved in the .csv format.

the endPoints are: 
http://localhost:3000/orders/getdata?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
http://localhost:3000/orders/getfile/{uuidHere} 
it will download the file in the local machine and delete the file from the server side permanently


<!-- http://localhost:3000/details/customer  => end point for the details of the customer excluded -->


http://localhost:3000/details/customer/:customerNumber => end point to get the details of the one customer

multer added to upload the files to the server

http://localhost:3000/merge/mergefile  add the two csv1 and csv2 in the postman to get tested

