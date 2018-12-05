module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var order_id;

    function getOrderMultiple(res, mysql, context, complete){
        mysql.pool.query("SELECT cust_id, emp_id, order_id, num_items, cost FROM orders", function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results;//BREAKS ANYTHING IF YOU TOUCH IT
            complete();
        });
    }
     
    function getOrderSingle(res, mysql, context, id, complete){
        var sql = "SELECT cust_id, emp_id, num_items, cost FROM orders WHERE order_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orderSingle = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOrderMultiple(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('order', context);
            }

        }
    });

    router.get('/:order_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateOrder.js"];
        var mysql = req.app.get('mysql');
        order_id = req.params.order_id;
        getOrderSingle(res, mysql, context, req.params.order_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-Order', context);
            }
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "SELECT cust_id FROM customers WHERE cust_id = ?"
        var inserts = [req.body.cust_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(!results.cust_id){
                sql = "INSERT INTO customers (cust_id, phone_num, fname, lname) VALUES (?, 'N/A','N/A','N/A')"
                inserts = [req.body.cust_id];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){});
                sql = "INSERT INTO orders (cust_id, emp_id, num_items, cost) VALUES (?,?,?,?)";
                inserts = [req.body.cust_id, req.body.emp_id, req.body.num_items, req.body.cost];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    if(error){
                        sql = "SELECT emp_id FROM employees WHERE emp_id = ?";
                        inserts = [req.body.emp_id];
                        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                            if(!results.emp_id){
                                sql = "INSERT INTO `employees`(`emp_id`, `fname`, `lname`, `pay`, `hours`) VALUES (?, 'N/A', 'N/A', 0, 0)"
                                inserts = [req.body.emp_id];
                                    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                                        if(error){
                                            res.write(JSON.stringify(error));
                                            res.end();
                                        }else{
                                            sql = "INSERT INTO orders (cust_id, emp_id, num_items, cost) VALUES (?,?,?,?)";
                                            inserts = [req.body.cust_id, req.body.emp_id, req.body.num_items, req.body.cost];
                                            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                                                if(error){
                                                    res.write(JSON.stringify(error));
                                                    res.end();
                                                }else{
                                                    res.redirect('/order');
                                                }
                                            });
                                        }
                                    });
                            }
                        });
                    }else{
                        res.redirect('/order');
                    }
                });
            }else{      
                sql = "INSERT INTO orders (cust_id, emp_id, num_items, cost) VALUES (?,?,?,?)";
                inserts = [req.body.cust_id, req.body.emp_id, req.body.num_items, req.body.cost];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.redirect('/order');
                    }
                });
            }
        });
    });

    router.put('/:order_id', function(req, res){
        console.log("put function")
        var mysql = req.app.get('mysql');
        var sql = "UPDATE orders SET cost=?, num_items=? WHERE order_id=?";
        var inserts = [req.body.cost, req.body.num_items, order_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)  
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    return router;
}();
