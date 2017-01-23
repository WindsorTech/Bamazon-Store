//NPM PACKAGES VARIABLES
var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');

//array for the products' IDs
var idNumbers = [];

//MYSQL CONNECTION VARIABLE
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
})

//CONNECTION COMMAND - WELCOME MESSAGE
connection.connect(function(err) {
    if (err) throw err;
    console.log("WELCOME TO BAMAZON! Products for Sale:")    
    //console.log("connected as id " + connection.threadId)
})

//DISPLAY ALL BAMAZON ITEMS FROM THE DATABASE 
connection.query("SELECT * FROM bamazon.products", function(err, rows) {
    if (err) throw err;

    console.log("--------------------------------");

    console.log("ID " + "    Product    " + "  Price ");

    console.log("--------------------------------");
    
    //loop through all the rows from database in order to display everything
    for (var i in rows) {
        console.log(rows[i].id + " - " + rows[i].ProductName + " - " + rows[i].Price);
    }

    console.log("--------------------------------");

    //function to crate an array with the products' IDs
    var idArray = function() {

	for (var i in rows) {
        idNumbers.push (rows[i].id);
    }
};
	//call function to add the products' ID to the array
    idArray();

    //call function to start the purchase process
    buyProduct();

});



//FUNCTION THAT RUNS THE PURCHASE PROCESS
var buyProduct = function(answer) {
	//Prompt that asks the user two questions: Product ID and Quantity
    inquirer.prompt([{
        name: "userID",
        type: "input",
        message: "Please enter the ID of the product you would like to buy:",
        validate: function(value) {//validate if the user's input is a number     
		if (isNaN(value) == false) {
                return true;
           } else {
                return false;
           }
        } 	
    },{
        name: "userQuantity",
        type: "input",
        message: "How many items would you like to purchase?",
        validate: function(value) {//validate if the user's input is a number
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        
        connection.query('SELECT * FROM bamazon.products WHERE ?', {id: answer.userID}, function(err, res) {
        	
        	// VARIABLES WITH THE INFO FROM USER'S PRODUCT SELECTION
			var productId = Number(answer.userID);
			var product = res[0].ProductName;
        	var price = res[0].Price;
        	var total = answer.userQuantity * price;
        	var quantity = res[0].StockQuantity;
        	var userQuant = answer.userQuantity;
        	
        	var arrayIndex = idNumbers.indexOf(productId);

			// If the quantity entered by user is less than what's in stock,
			// ask the user to enter a lower number
			if (quantity < answer.userQuantity) {
				console.log("Insufficient quantity! Try buying fewer items.");
				buyProduct();
			} else {
			//If the order is OK, display a summary and grand total
				console.log("--------------------------------");
        		console.log("YOUR ORDER");
        		console.log("--------------------------------");
				console.log("Product: " + product);
				console.log("Price: " + price);
				console.log("Quantity: " + answer.userQuantity);
				console.log("Grand Total: " + total);
				console.log("--------------------------------");

				//Ask the user to confirm order (Yes or Cancel)
				inquirer.prompt([{
        			name: "confirm",
        			type: "list",
        			message: "Select 'Yes' to confirm or 'Cancel' to cancel your order",
        			choices: ['Yes', 'Cancel']
    			}]).then(function(answer) {
    				//If the user confirms the order, send a Thank You message
    				if (answer.confirm == 'Yes'){
    					console.log("Your item(s) will be shipped as soon as possible. Thank You for Shopping with Us!");
    					buyProduct();

    					//UPDATE STOCK QUANTITY//
						connection.query("UPDATE bamazon.products SET StockQuantity = StockQuantity - ? WHERE productName = ?",[userQuant, product], function(err, res) {	
						});

    				} else { //If the user cancels the order, try again!
    					console.log("Oh no! Please try again!");
    					buyProduct();
    				}
    			})

			}

        })

    })


};
