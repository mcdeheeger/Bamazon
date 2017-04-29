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

function runManager() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        inquirer.prompt({
            name: "menuSelection",
            type: "list",
            message: "How would you like to manage today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }).then(function (answer) {
            switch (answer.menuSelection) {
                case "View Products for Sale":
                    forSale();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addNew();
                    break;
            }
        });
    });
};

function forSale() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        };
    });
    runManager();
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
            };
        };
    });
    runManager();
};



function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        inquirer.prompt([{
                name: "selectItem",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Choose an item for restocking"
            },
            {
                name: "addedAmount",
                type: "input",
                message: "How much stock would you like to add?"
            }]).then(function (answer) {

                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: parseFloat(res[choiceArray.indexOf(answer.selectItem)].stock_quantity) + parseFloat(answer.addedAmount)
                }, {
                    product_name: answer.selectItem
                }], function (err, res) {
                    runManager();
                });
            });
    });
};

function addNew() {

    inquirer.prompt([{
        name: "newProduct_Name",
        type: "input",
        message: "What is the name of the item you would like to add?"
    },
    {
        name: "newDepartmentName",
        type: "input",
        message: "What is the department name?"
    },
    {
        name: "newPrice",
        type: "input",
        message: "What is the price?"
    },
    {
        name: "newStockQuantity",
        type: "input",
        message: "How much inventory would you like to add?"
    }]).then(function (answer) {

        connection.query("INSERT INTO products SET ?", {
            product_name: answer.newProduct_Name,
            department_name: answer.newDepartmentName,
            price: answer.newPrice,
            stock_quantity: answer.newStockQuantity
        }, function(err, res) {
            runManager();
        });
    });
};

runManager();