# sequelize-in-nodeJS-expressJS

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
