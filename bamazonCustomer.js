//npm packages downloaded for application
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//creating connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: "root",

    // password
    password: "Sexyp333",
    database: "Bamazon"
});

//variables used for storing information
var newinventory;
var id;

//updating the inventory based on user input
var shopping = function (){
    connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [newinventory,id], function (err, res){
        console.log(newinventory);
    });
};



//function to print all items to the console, uses npm module cli-table
var printItems = function() {

        //new cli-table
        var table = new Table({
            head: ['Database ID','Product', 'Department', 'Price', 'Quantity Available'],
            colWidths: [10,30,20,10,10]
        });
        //get all rows from the Products table
        connection.query('SELECT * FROM products', function(err, res) {
                //sorts through the items located in mysql
                    for (var i = 0; i < res.length; i++) {
                        table.push([res[i].id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]);
                    }
                    //prints the items into the cli-table in the terminal from mysql  
                    console.log(table.toString());
                    console.log("Above are the items available for purchase from Bamazon")
                    //msg displayed to shoper after seeing inventory
                    inquirer.prompt([{
                            name: 'id',
                            message: 'What is the Database ID of the item you would like to buy?'
                        }, {
                            name: 'units',
                            message: 'How many units of the product would you like to buy?'
                        }
                        //dislpays information based on user input
                    ]).then(function(answer) {
                        var query = "SELECT id, stock_quantity, price FROM products WHERE ?";
                        connection.query(query, { id: answer.id }, function(err, res) {
                            id = answer.id;
                            newinventory = res[0].stock_quantity - answer.units;
                            //checks inventory to see if purchase is possible
                                console.log("Product ID " + res[0].id);
                                if (res[0].stock_quantity > answer.units){
                                    shopping();
                                    console.log("The cost of the item is:" + "$" + res[0].price);
                                    console.log ("Total Cost of Order is:"  + "$" + res[0].price * answer.units);
                                }
                                //if there are not enough stored in inventory msg will display
                                else {console.log("Insufficient Quantity!")}
                        });
                        printItems();
                    });
                    });
                    };

                    printItems();

