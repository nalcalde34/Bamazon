var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection successful');
    runBamazon();
});

//Main prompt menu
function promptManagerMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Hello Bamazon Manager, please select an option',
            choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            filter: function (val) {
                if (val == 'View Products For Sale') {
                    return 'sale';
                } else if (val == 'View Low Inventory') {
                    return 'lowInventory';
                } else if (val == 'Add to Inventory') {
                    return 'addInventory';
                } else if (val == 'Add New Product') {
                    return 'newProduct';
                } else {
                    console.log("Error: Invalid input. Please choose from one of the provided options.");
                    // exit(1);
                }
            }
        }
    ]).then(function(input) {
        //Run proper function based on user's input
        if (input.option == 'sale') {
            displayInventory();
        } else if (input.option == 'lowInventory') {
            displayLowInventory();
        } else if (input.option == 'addInventory') {
            addInventory();
        } else if (input.option == 'newProduct') {
            createNewProduct();
        } else {
            console.log("Error: unsupported operation");
            // exit(1);
        }
    })
}


//Gets current inventory data from SQL database and displays it
function displayInventory() {

    queryStr = 'SELECT * FROM products';
  
    connection.query(queryStr, function(err, data) {
      if (err) throw err;
  
      console.log("Current Inventory: ");
      console.log("..........\n");
  
      var showInv = '';
      //Loop through table
      for (var i = 0; i < data.length; i++) {
        showInv = '';
        showInv += 'Product ID: ' + data[i].id + ' // ';
        showInv += 'Product Name: ' + data[i].product_name + ' // ';
        showInv += 'Department: ' + data[i].department_name + ' // ';
        showInv += 'Price: $' + data[i].price + '\n';
  
        console.log(showInv);
      }
  
      console.log("----------\n");
      connection.end();
    })
}


function displayLowInventory() {
    queryStr = 'SELECT * FROM products WHERE stock_quantity < 15';

    connection.query(queryStr, function(err, data) {
        if (err) throw err;

        console.log("Low Inventory Items (Quantity Below 15): ");
        console.log("..........\n");

        var strOutput = '';
        for (var i = 0; i < data.length; i++) {
            strOutput = '';
            strOutput += 'Item ID: ' + data[i].id + ' // ';
            strOutput += 'Product Name: ' + data.product_name + ' // ';
            strOutput += 'Department: ' + data.department_name + ' // ';
            strOutput += 'Price: ' + data.price + ' // ';
            strOutput += 'Quantity: ' + data.stock_quantity + '\n';

            console.log(strOutput);
        }

        console.log("----------\n");
        connection.end();
    })
}

//validate user inputs
function validateInteger(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);
  
    if (integer && (sign === 1)) {
      return true;
    }  else {
      return 'Please enter a whole number.';
    }
  }

  function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

//addInventory function lets the Manager increase a product's current 'stock_quantity'
function addInventory() {
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the Item ID to update stock_quantity.',
            validate: validateInteger,
            filter: Number
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How mant would you like to add?',
            validate: validateInteger,
            filter: Number
        }
    ]).then(function(input) {

        var item = input.id;
        var addQuantity = input.stock_quantity;

        //query SQL database to make sure id exists and check current stock count
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {id: item}, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("ERROR: Invalid Item ID");
                addInventory();
            
            } else {
                var productData = data[0];
                console.log("Updating inventory...");

                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE id = ' + item;

                //update the inventory
                connection.query(updateQueryStr, function(err, data) {
                    if (err) throw err;

                    console.log("Stock count for Item ID " + item + "has been updated to " + (productData.stock_quantity + addQuantity) + '.');
                    console.log("\n----------\n");

                    connection.end();
                })
            }
        })
    })
}

function createNewProduct() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter a name for the new product.',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department will the new product belong to?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'What is the price of this new product?',
            validate: validateNumeric
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many will be in stock?',
            validate: validateInteger
        }
    ]).then(function(input) {

        console.log("Adding new product: \n  product_name = " + input.product_name + '\n' + 
                                            'department_ name = ' + input.department_name + '\n' + 
                                            'price = ' + input.price + '\n' + 
                                            'stock_quantity = ' + input.stock_quantity);

        var queryStr = 'INSERT INTO products SET ?';

        //query to add new product to SQL database
        connection.query(queryStr, input, function (error, results, fields) {
            if (error) throw error;

            console.log("New product has been added to the inventory. Item ID is: " + results.insertId + '.');
            console.log("\n----------\n");

            connection.end();
        });
    })
}


function runBamazon() {
    promptManagerMenu();
}