module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // function getPlanets(res, mysql, context, complete){
    //     mysql.pool.query("SELECT cust_id, emp_id, order_id, num_items, cost FROM orders", function(error, results, fields){
    //         if(error){
    //             console.log(error);
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.order  = results;
    //         complete();
    //     });
    // }

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

    // function getOrderbyHomeworld(req, res, mysql, context, complete){
    //   var query = "SELECT bsg_Order.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_Order INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_Order.homeworld = ?";
    //   console.log(req.params)
    //   var inserts = [req.params.homeworld]
    //   mysql.pool.query(query, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.Order = results;
    //         complete();
    //     });
    // }

    /* Find Order whose fname starts with a given string in the req */
    // function getOrderWithNameLike(req, res, mysql, context, complete) {
    //   //sanitize the input as well as include the % character
    //    var query = "SELECT bsg_Order.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_Order INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_Order.fname LIKE " + mysql.pool.escape(req.params.s + '%');
    //   console.log(query)

    //   mysql.pool.query(query, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.Order = results;
    //         complete();
    //     });
    // }
     
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

    /*Display all OrdeSr. Requires web based javascript to delete users with AJAX*/

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

    /*Display all Order from a given homeworld. Requires web based javascript to delete users with AJAX*/
//     router.get('/filter/:homeworld', function(req, res){
//         var callbackCount = 0;
//         var context = {};
//         context.jsscripts = ["deleteperson.js","filterOrder.js","searchOrder.js"];
//         var mysql = req.app.get('mysql');
//         getOrderbyHomeworld(req,res, mysql, context, complete);
//         getPlanets(res, mysql, context, complete);
//         function complete(){
//             callbackCount++;
//             if(callbackCount >= 2){
//                 res.render('Order', context);
//             }

//         }
//     });

//     /*Display all Order whose name starts with a given string. Requires web based javascript to delete users with AJAX */
//     router.get('/search/:s', function(req, res){
//         var callbackCount = 0;
//         var context = {};
//         context.jsscripts = ["deleteperson.js","filterOrder.js","searchOrder.js"];
//         var mysql = req.app.get('mysql');
//         getOrderWithNameLike(req, res, mysql, context, complete);
//         getPlanets(res, mysql, context, complete);
//         function complete(){
//             callbackCount++;
//             if(callbackCount >= 2){
//                 res.render('Order', context);
//             }
//         }
//     });

//     /* Display one person for the specific purpose of updating Order */

    router.get('/:order_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateOrder.js"];
        var mysql = req.app.get('mysql');
        getOrderSingle(res, mysql, context, req.params.order_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-Order', context);
            }
        }
    });

//     /* Adds a person, redirects to the Order page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO orders (cust_id, emp_id, num_items, cost) VALUES (?,?,?,?)";
        var inserts = [req.body.cust_id, req.body.emp_id, req.body.num_items, req.body.cost];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/order');
            }
        });
    });

//     /* The URI that update data is sent to in order to update an order */

    router.put('/:order_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE orders SET cost=?, num_items=? WHERE order_id=?";
        var inserts = [req.body.cost, req.body.num_items, req.params.order_id];
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

//     /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

//     router.delete('/:id', function(req, res){
//         var mysql = req.app.get('mysql');
//         var sql = "DELETE FROM bsg_Order WHERE character_id = ?";
//         var inserts = [req.params.id];
//         sql = mysql.pool.query(sql, inserts, function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.status(400);
//                 res.end();
//             }else{
//                 res.status(202).end();
//             }
//         })
//     })

    return router;
}();
