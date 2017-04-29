var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
});

function showSelectBuy() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        };


        inquirer.prompt([
            {
                name: "item_id",
                type: "input",
                message: "Type in the id for the item you would like to purchase."
            }, {
                name: "quantity",
                type: "input",
                message: "How many of this item would you like to purchase?"
            }
        ]).then(function (answer) {
            var item_id = res[(answer.item_id - 1)]

            if (item_id.stock_quantity > answer.quantity) {
                console.log(res[answer.item_id - 1].product_name);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: item_id.stock_quantity - answer.quantity
                }, {
                    item_id: answer.item_id
                }]);
                console.log("$" + (answer.quantity * item_id.price).toFixed(2))
            } else {
                console.log("Insufficient Stock!");
            };

        });
    });
};
//
showSelectBuy();
