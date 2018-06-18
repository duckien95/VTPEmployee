var express = require('express');
var router = express.Router();
var EmployeeSchema = require('../models/Employee.js');
var moment = require('moment');

//connect to mongodb vtp4rum
var mongoose = require('mongoose');
mongoose.connect('mongodb://vtp4rum:123456a%40@125.212.238.119:27017/vtp4rum');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/employees', function(req, res) {
    EmployeeSchema.find({})
    .then(
        employees => {
            console.log(employees.length);
            var employeeList = {};
            for (var i = 0; i < employees.length; i++) {
                employeeList[i] = employees[i].fullName;
            }
            res.json({
                employees: employees
            })
        }
    );
})

router.get('/', function(req, res){
    res.redirect('/employees/1');
})

router.get('/employees/:page', function(req, res) {
    var perPage = 10;
    var page = req.params.page || 1;

    EmployeeSchema
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, employeeList) {
            EmployeeSchema.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('employees', {
                    employeeList: employeeList,
                    maxPage: 13,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    index: perPage * page - perPage,
                    title: 'Danh sách nhân viên Tổng Công ty Cổ phần Bưu chính Viettel',
                    moment: moment
                })
            })
        })
})

module.exports = router;
