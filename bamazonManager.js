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
var newQuantity;
//what allows the user to add a new item to the inventory 
var addNew = function() {
    inquirer.prompt([{
    name: "productName",
    message: "What is the name of your product?"
    },
    {
    name: "dept",
    message: "Which department is it in?",
    },
    {
    name: "price",
    message: "How much does it cost?",
    },
    {
    name: "quantity",
    message: "How many would you like to add?",
    }
  ]).then(function(answers) {
    var productName = answers.productName;
    var dept = answers.dept;
    var price = answers.price;
    var quantity = answers.quantity;
    connection.query('INSERT INTO products SET ?',{product_name:productName, department_name:dept, price:price, stock_quantity:quantity}, function(err, res) {
    });
    managerChoices();

	});
};
//this prompts all of the choices 
var managerChoices = function() {

	inquirer.prompt([{		type:'list',
                            name: 'choice',
                            message: 'What would you like to do?',
                            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory','Add New Product']
                        }
]).then (function(answer) {
	//statement to decide if user wants to view product
	if (answer.choice === 'View Products for Sale' ){
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
                    console.log("Above are the items available for purchase from Bamazon Manager")
        
               })
        managerChoices();
    }

//statement that shows the low inventory 
if (answer.choice === 'View Low Inventory'){
	//new cli-table
        var table = new Table({
            head: ['Database ID','Product', 'Department', 'Price', 'Quantity Available'],
            colWidths: [10,30,20,10,10]
        });
        //get all rows from the Products table
        connection.query('SELECT * FROM products GROUP BY id HAVING stock_quantity < 5', function(err, res) {
                //sorts through the items located in mysql
                    for (var i = 0; i < res.length; i++) {
                        table.push([res[i].id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]);
                    }
                    //prints the items into the cli-table in the terminal from mysql  
                    console.log(table.toString());


	});
        managerChoices();
    }
    //this allows the user to add an amount to their inventory
if (answer.choice === 'Add to Inventory'){
	inquirer.prompt([{
                            name: 'addItem',
                            message: 'What is the Database ID of the item you would like to add to?'
                        },
                        {	name: 'addamount',
                        	message:'How many would you like to add?'}
                        ]).then(function(answer) {
                        	id = answer.addItem;
	connection.query('SELECT * FROM products WHERE id = ?', id, function (err, res){
        quantity = res[0].stock_quantity;
        newQuantity = parseFloat(answer.addamount) + parseFloat(quantity);
        console.log(quantity);
    });
    managerChoices();
	});
	}
//if statement for adding new product
	if (answer.choice === 'Add New Product'){
		addNew();
	}


});
};


managerChoices();
