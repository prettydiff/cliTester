/*prettydiff.com api.topcoms: true, api.insize: 4, api.inchar: " ", api.vertical: true */
/*jslint node:true */
/***********************************************************************
 PDrunner is written by Austin Cheney on 26 June 2015.  Anybody may use
 this code without permission so long as this comment exists verbatim in
 each instance of its use.

 http://prettydiff.com/
***********************************************************************/

//todo
//* create output function - .replace(/\n/g, "\\n")
//* allow functions/commands as assertions
//* allow support for multiple test files

(function testrunner() {
    "use strict";
    var count     = [], //test index in local group
        passcount = [], //passing tests in local group
        grouplen  = [], //length of local group
        groupname = [], //name of current group
        grouprec  = [], //child groups need to run after data peers are complete
        teardowns = [], //a list of tear down lists
        unitflag  = true,
        total     = 0, //total number of tests
        gcount    = 0, //total number of groups
        fgroup    = 0, //total number of groups containing failed tests
        fails     = 0, //total number of failed tests
        single    = false,
        tests     = (function () {
            var location = process.argv[2],
                loctry = (typeof location === "string" && location.length > 0) ? require(location) : require("./tests.js");
            if (typeof loctry.tests === "object" && loctry.tests.length > 0) {
                return loctry.tests;
            }
        }()),
        shell     = function testrunner__shell(testData) {
            var childExec = require("child_process").exec,
                child = function testrunner__shell_child(param) {
                    if (typeof param.group === "string") {
                        grouplen[grouplen.length - 1] -= 1;
                        return grouprec.push(param);
                    }
                    childExec(param.check, function testrunner__shell_child(err, stdout, stderr) {
                        var data      = [param.name],
                            spare     = {},
                            //what to do when a group concludes
                            writeLine = function writeLine(item) {
                                var fail    = 0,
                                    failper = 0,
                                    plural  = "",
                                    groupn  = single
                                        ? ""
                                        : " for group: \x1B[39m\x1B[33m" + groupname[0] + "\x1B[39m",
                                    totaln  = single
                                        ? ""
                                        : " in current group, " + total + " total",
                                    status  = (item[1] === "pass") ? "\x1B[32mPass\x1B[39m test " : "\x1B[31mFail\x1B[39m test ",
                                    teardown = function testrunner__shell_teardown(tasks) {
                                        var a = 0,
                                            len = tasks.length,
                                            task = function testrunner__shell_teardown_task() {
                                                console.log(tasks[a]);
                                                childExec(tasks[a], function testrunner__shell_teardown_task_exec(err, stdout, stderr) {
                                                    a += 1;
                                                    if (typeof err === "string") {
                                                        console.log(err);
                                                    } else if (typeof stderr === "string" && stderr !== "") {
                                                        console.log(stderr);
                                                    } else {
                                                        if (a === len) {
                                                            console.log("Tear down for group \x1B[36m" + groupname[groupname.length - 1] + "\x1B[39m complete.\n");
                                                        } else {
                                                            task();
                                                        }
                                                    }
                                                });
                                            };
                                        task();
                                    };
                                if (single === false && count[count.length - 1] === 1) {
                                    console.log("\n\n\x1B[36mTest group: \x1B[39m\x1B[33m" + groupname[0] + "\x1B[39m");
                                }
                                console.log(status + count[count.length - 1] + " of " + grouplen[grouplen.length - 1] + totaln);
                                console.log(item[0]);
                                if (item[1] === "pass") {
                                    console.log("");
                                } else {
                                    console.log(item[2]);
                                }
                                if (count[count.length - 1] === grouplen[grouplen.length - 1]) {
                                    if (passcount[passcount.length - 1] === count[count.length - 1]) {
                                        if (grouplen[grouplen.length - 1] === 1) {
                                            console.log("\x1B[32mThe test passed" + groupn + "\x1B[39m");
                                        } else {
                                            console.log("\x1B[32mAll " + grouplen[grouplen.length - 1] + " tests passed" + groupn + "\x1B[39m");
                                        }
                                    } else {
                                        fail    = count[count.length - 1] - passcount[passcount.length - 1];
                                        fails += fail;
                                        if (passcount[passcount.length - 1] === 0) {
                                            if (grouplen[grouplen.length - 1] === 1) {
                                                console.log("\x1B[31mThe test failed" + groupn + "\x1B[39m");
                                            } else {
                                                console.log("\x1B[31mAll " + grouplen[grouplen.length - 1] + " tests failed" + groupn + "\x1B[39m");
                                            }
                                        } else {
                                            fgroup += 1;
                                            failper = (fail / grouplen[grouplen.length - 1]) * 100;
                                            if (fail > 1) {
                                                plural = "s";
                                            }
                                            console.log("\x1B[31m" + fail + "\x1B[39m test" + plural + " (" + failper.toFixed(0) + "%) failed of \x1B[32m" + count[count.length - 1] + "\x1B[39m tests" + groupn + ".");
                                        }
                                    }
                                    grouplen.pop();
                                    groupname.pop();
                                    count.pop();
                                    passcount.pop();
                                    if (grouprec.length > 0) {
                                        spare = grouprec[0];
                                        grouprec.splice(0, 1);
                                        unitflag = true;
                                        shell(spare);
                                    } else if (gcount > 0) {
                                        console.log("\n\nAll tests complete.");
                                        plural = (total === 1) ? "" : "s";
                                        totaln = (fails === 1) ? "" : "s";
                                        groupn = (fgroup === 1) ? "" : "s";
                                        status = (gcount === 1) ? "" : "s";
                                        if (fails === 0) {
                                            console.log("\x1B[32mPassed all " + total + " test" + plural + " from all " + gcount + " groups.\x1B[39m");
                                        } else if (fails === total) {
                                            console.log("\x1B[31mFailed all " + total + " test" + plural + " from all " + gcount + " groups.\x1B[39m");
                                        } else {
                                            console.log("\x1B[31mFailed " + fails + " test" + totaln + " from " + fgroup + " group" + groupn + "\x1B[39m out of " + total + " total tests across " + gcount + " group" + status + ".");
                                        }
                                    }
                                    if (teardowns.length > 0) {
                                        if (teardowns[teardowns.length - 1].length > 0) {
                                            teardown(teardowns.pop());
                                        } else {
                                            teardowns.pop();
                                        }
                                    }
                                }
                            };
                        //determine pass/fail status of a given test unit
                        if (typeof err === "string") {
                            data.push("fail");
                            data.push(err);
                        } else if (typeof stderr === "string" && stderr !== "") {
                            data.push("fail");
                            data.push(stderr);
                        } else if (stdout !== param.verify + "\n") {
                            data.push("fail");
                            data.push("Unexpected output:  " + stdout);
                        } else {
                            passcount[passcount.length - 1] += 1;
                            data.push("pass");
                            data.push(stdout);
                        }
                        count[count.length - 1] += 1;
                        total += 1;
                        writeLine(data);
                    });
                },
                units = [],
                buildup = function testrunner__shell_buildup(tasks) {
                    var a = 0,
                        len = tasks.length,
                        task = function testrunner__shell_buildup_task() {
                            console.log(tasks[a]);
                            childExec(tasks[a], function testrunner__shell_buildup_task_exec(err, stdout, stderr) {
                                a += 1;
                                if (typeof err === "string") {
                                    console.log("\x1B[31mError:\x1B[39m " + err);
                                    console.log("Terminated early");
                                } else if (typeof stderr === "string" && stderr !== "") {
                                    console.log("\x1B[31mError:\x1B[39m " + stderr);
                                    console.log("Terminated early");
                                } else {
                                    if (a === len) {
                                        console.log("Buildup for group \x1B[36m" + testData.group + "\x1B[39m complete.");
                                        units.forEach(child);
                                    } else {
                                        task();
                                    }
                                }
                            });
                        };
                    task();
                },
                prepGroup = function testrunner__shell_prepGroup() {
                    if (grouplen.length > 0) {
                        grouplen[grouplen.length - 1] -= 1;
                    }
                    grouplen.push(testData.units.length);
                    groupname.push(testData.group);
                    groupname.splice(0, 0, testData.group);
                    units = testData.units;
                    gcount += 1;
                    if (typeof testData.teardown === "object" && testData.teardown.length > 0) {
                        teardowns.push(testData.teardown);
                    } else {
                        teardowns.push([]);
                    }
                },
                prepDirect = function testrunner__shell_prepDirect() {
                    grouplen.push(tests.length);
                    units = tests;
                    single = true;
                };
            count.push(0);
            passcount.push(0);
            if (typeof testData.group === "string") {
                prepGroup();
            } else {
                if (unitflag === false) {
                    return;
                }
                prepDirect();
            }
            if (unitflag === true) {
                unitflag = false;
                if (typeof testData.buildup === "object" && testData.buildup.length > 0) {
                    buildup(testData.buildup);
                } else {
                    units.forEach(child);
                }
            } else {
                grouprec.push(testData);
            }
        };
    tests.forEach(shell);
}());
