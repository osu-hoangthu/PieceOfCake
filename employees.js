module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getEmployeesPlural(res, mysql, context, complete){
        mysql.pool.query("SELECT emp_id, fname, lname, pay, hours FROM employees", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.empPlural = results;
            complete();
        });
    }
     
    function findEmployee(res, mysql, context, id, complete){
        var sql = "SELECT emp_id, fname, lname, pay, hours FROM employees WHERE emp_id =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.empPlural = results;
            complete();
        });
    }

    //find employee by ID
    router.get('/:emp_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts=["searchEmployees.js"];
        var mysql = req.app.get('mysql');
        var id = req.params.emp_id.substring(req.params.emp_id.lastIndexOf(':id') + 1);
        findEmployee(res, mysql, context, id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }
        }
    });

    //get all employees
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts=["searchEmployees.js"]
        var mysql = req.app.get('mysql');
        getEmployeesPlural(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO employees (fname, lname, pay, hours) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.pay, req.body.hours];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/employees');
            }
        });
    });

    return router;
}();
