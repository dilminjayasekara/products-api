var express = require("express")
var app = express()
var db = require("./database.js")
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8080
const cors = require('cors');
app.use(cors({
    origin: '*'
}));



// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/api/products", (req, res, next) => {
    try {
        var sql = "select * from products"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});

app.get("/api/products/:id", (req, res, next) => {
    try {
        var sql = "select * from products where id = ?"
        var params = [req.params.id]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/quantity/:quantity", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where quantity > ?"
        var params = [req.params.quantity]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/unitPrice/:unitPrice", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where unitPrice > ?"
        var params = [req.params.unitPrice]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            } else {
                res.json({

                    "message": "success",
                    "data": row
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.post("/api/products/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { productName,
            description,
            category,
            brand,
            expiredDate,
            manufacturedDate,
            batchNumber,
            unitPrice,
            quantity,
            createdDate
        } = req.body;

        var sql = 'INSERT INTO products (productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var params = [productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.put("/api/products/", (req, res, next) => {


    const {
        id,
        productName,
        description,
        category,
        brand,
        expiredDate,
        manufacturedDate,
        batchNumber,
        unitPrice,
        quantity,
        createdDate
    } = req.body;

    db.run(`UPDATE products set productName = ?, description = ?, category = ?, brand = ?,expiredDate=?,manufacturedDate=?,batchNumber=?,unitPrice=?,quantity=?,createdDate=? WHERE id = ?`,
        [productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate, id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});


app.delete("/api/products/delete/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM products WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/products/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM products WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.get("/api/suppliers/", (req, res, next) => {
    try {
        var sql = "select * from suppliers"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});


app.post("/api/suppliers/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { supplierName,
            address,
            joinedDate,
            mobileNo
        } = req.body;

        var sql = 'INSERT INTO suppliers (supplierName, address, joinedDate, mobileNo) VALUES (?,?,?,?)'
        var params = [supplierName, address, joinedDate, mobileNo]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/suppliers/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM suppliers WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "University of Moratuwa" })
});

const express = require('express');
const db = require('./database'); // Adjust path if different

const app = express();
app.use(express.json()); // For parsing JSON bodies

// Existing routes... (e.g., products)

// Add this new POST route for customer registration
app.post('/customers', (req, res) => {
  const { name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp } = req.body;

  // Validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!cardNumber || !/^\d{12}$/.test(cardNumber)) {
    return res.status(400).json({ error: 'Credit card number must be exactly 12 digits' });
  }
  // Add more validations if needed (e.g., required fields check)
  if (!name || !address || !dateOfBirth || !gender || !age || !cardHolderName || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert into DB
  const stmt = db.prepare(`INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run([name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp || new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Registration failed (e.g., duplicate email/card)' });
    }
    // Success: Get the generated ID (this.id is from SQLite callback)
    res.status(201).json({ 
      message: `customer ${name} has registered`, 
      customerId: this.lastID 
    });
  });
  stmt.finalize();
});

// Existing code... (e.g., app.listen(3000))
