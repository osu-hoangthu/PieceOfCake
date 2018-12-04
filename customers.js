module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomersPlural(res, mysql, context, complete){
        mysql.pool.query("SELECT cust_id, phone_num, fname, lname FROM customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerPlural = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"]
        var mysql = req.app.get('mysql');
        getCustomersPlural(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customers (phone_num, fname, lname) VALUES (?,?,?)";
        var inserts = [req.body.phone_num, req.body.fname, req.body.lname];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    router.delete('/:cust_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM orders_menuitems WHERE order_id = (SELECT order_id FROM orders WHERE cust_id = ?)";
        console.log(req.params.cust_id);
        var inserts = [req.params.cust_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                sql = "DELETE FROM orders WHERE cust_id = ?";
                inserts = [req.params.cust_id];
                sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        sql = "DELETE FROM customers WHERE cust_id = ?";
                        insert = [req.params.cust_id];
                        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                            if(error){
                                res.write(JSON.stringify(error));
                                res.status(400);
                                res.end();
                            }else{
                                res.status(202).end();
                            }
                        })
                    }
                });
            }
        })
    })

    return router;
}();
