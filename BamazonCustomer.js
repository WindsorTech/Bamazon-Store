var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');
var consoletable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "toneros13",
    database: "Bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("WELCOME TO BAMAZON! Products for Sale:")
    
    //console.log("connected as id " + connection.threadId);

})
 
connection.query("SELECT * FROM bamazon.products", function(err, rows) {
    if (err) throw err;

    console.log("--------------------------------");

    console.log("ID " + "    Product    " + "  Price ");

    console.log("--------------------------------");

    for (var i in rows) {
        console.log(rows[i].id + " - " + rows[i].ProductName + " - " + rows[i].Price);
    }

    console.log("--------------------------------");

    buyProduct();

});

//=============================================//

var buyProduct = function() {
    inquirer.prompt([{
        name: "userID",
        type: "input",
        message: "Please enter the ID of the product you would like to buy:",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "userQuantity",
        type: "input",
        message: "How many items would you like to purchase?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {

        connection.query('SELECT * FROM bamazon.products WHERE ?', {id: answer.userID}, function(err, res) {
			var product = res[0].ProductName;
        	var price = res[0].Price;
        	var total = answer.userQuantity * price;
        	var quantity = res[0].StockQuantity;
			//console.log("Quantity in Stock: " + quantity);

        	if (quantity < answer.userQuantity) {
				console.log("Insufficient quantity! Try buying fewer items.");
				buyProduct();
			} else {
				//////DO IT HERE TOMORROW!!
				console.log("--------------------------------");
        		console.log("YOUR ORDER");
        		console.log("--------------------------------");
				console.log("Product: " + product);
				console.log("Price: " + price);
				console.log("Quantity: " + answer.userQuantity);
				console.log("Grand Total: " + total);
				console.log("--------------------------------");

				inquirer.prompt([{
        			name: "confirm",
        			type: "list",
        			message: "Select 'Yes' to confirm or 'Cancel' to cancel your order",
        			choices: ['Yes', 'Cancel']
    			}]).then(function(answer) {
    				if (answer.confirm == 'Yes'){
    					console.log("Your item(s) will be shipped as soon as possible. Thank You for Shopping with Us!");
    					buyProduct();
    				}else {
    					console.log("Oh no! Please try again!");
    					buyProduct();
    				}
    			})

			}

        })

    })


};
