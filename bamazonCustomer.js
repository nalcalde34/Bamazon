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


function validateInput(value) {
  var integer = Number.isInteger(parseFloat(value));
  var sign = Math.sign(value);

  if (integer && (sign === 1)) {
    return true;
  }  else {
    return 'Please enter a whole number.';
  }
}

function promptPurchase(){
  inquirer.prompt([
    {
    type: 'input',
    name: 'id',
    message: 'Enter the item ID for the product you would like to purchase',
    validate: validateInput,
    filter: Number
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many of this product would you like to purchase?',
      validate: validateInput,
      filter: Number
    }
  ]).then(function(input){
    
    var item = input.id;
    var quantity = input.quantity;

    //query the database to confirm the id exists
    var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {id: item}, function(err, data) {
      if (err) throw err;

      if (data.length === 0) {
        console.log('Error: You have entered an invalid product ID');
        displayInventory();

      } else {
        var productData = data[0];

        //If the quantity requested is in stock
        if (quantity <= productData.stock_quantity) {
          console.log("Product(s) in stock! Placing order now.");

          var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE id = ' + item;

          //Update inventory
          connection.query(updateQueryStr, function(err, data) {
            if (err) throw err;

            console.log('Your order has been placed! Total is: $' + productData.price * quantity);
            console.log("\n----------\n");

            connection.end();
          })
        } else {
          console.log("Unfortunately we do not have enough of this product in stock");
          console.log("Please decrease the amount you are trying to purchase, or choose another product.");
          console.log("\n----------\n");

          displayInventory();
        }
      }
    })
  })
}

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

    //Prompt user for product and quantity they want to purchase
    promptPurchase();
  })
}

function runBamazon() {
  displayInventory();
}



