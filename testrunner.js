/*prettydiff.com api.topcoms: true, api.insize: 4, api.inchar: " ", api.vertical: true */

/*jslint node:true, for:true */

/***********************************************************************
 PDrunner is written by Austin Cheney on 26 June 2015.  Anybody may use
 this code without permission so long as this comment exists verbatim in
 each instance of its use.

 http://prettydiff.com/
***********************************************************************/

/*pending tasks
 * write a generate output function - .replace(/\n/g, "\\n")
 * allow functions/commands as assertions
 * allow support for multiple test files
 */

(function testrunner() {
    "use strict";
    var passcount = [], //passing tests in local group
        complete  = [], //completed tests in local group
        grouplen  = [], //length of local group
        groupname = [], //name of current group
        teardowns = [], //a list of tear down lists
        units     = [], //test unit arrays
        index     = [], //current array index of current group
        total     = 0, //total number of tests
        gcount    = 0, //total number of groups
        fgroup    = 0, //total number of groups containing failed tests
        fails     = 0, //total number of failed tests
        depth     = -1, //current depth
        single    = false,//look for the unit test file
        tablen    = 2,//size of indentation in spaces
        tests     = (function () {
            var location = process.argv[2],
                loctry   = (typeof location === "string" && location.length > 0)
                    ? require(location)
                    : require("./tests.js");
            if (typeof loctry.tests === "object" && loctry.tests.length > 0) {
                return loctry.tests;
            }
        }()),
        unitsort  = function (aa, bb) {
            if (aa.group === undefined && bb.group !== undefined) {
                return 1;
            }
            return -1;
        },
        shell     = function testrunner__shell(testData) {
            var childExec = require("child_process").exec,
                tab       = (function testrunner__shell_child_writeLine_tab() {
                    var a   = 0,
                        b   = 0,
                        str = "";
                    for (a = depth + 2; a > 0; a -= 1) {
                        for (b = tablen; b > 0; b -= 1) {
                            str += " ";
                        }
                    }
                    return str;
                }()),
                child     = function testrunner__shell_child(param) {
                    childExec(param.check, function testrunner__shell_child(err, stdout, stderr) {
                        var data      = [param.name],
                            //what to do when a group concludes
                            writeLine = function writeLine(item) {
                                var fail          = 0,
                                    failper       = 0,
                                    plural        = "",
                                    groupn        = single
                                        ? ""
                                        : " for group: \x1B[39m\x1B[33m" + groupname[depth] + "\x1B[39m",
                                    totaln        = single
                                        ? ""
                                        : " in current group, " + total + " total",
                                    status        = (item[1] === "pass")
                                        ? "\x1B[32mPass\x1B[39m test "
                                        : "\x1B[31mFail\x1B[39m test ",
                                    groupEnd      = function testrunner__shell_child_writeLine_groupEnd() {
                                        var groupPass = false;
                                        if (teardowns[depth].length === 0) {
                                            console.log("");
                                        }
                                        if (passcount[depth] === complete[depth]) {
                                            if (grouplen[depth] === 1) {
                                                console.log(tab.slice(tablen) + "\x1B[32mThe test passed" + groupn + "\x1B[39m");
                                            } else {
                                                console.log(tab.slice(tablen) + "\x1B[32mAll " + grouplen[depth] + " tests passed" + groupn + "\x1B[39m");
                                            }
                                            groupPass = true;
                                        } else {
                                            if (passcount[depth] === 0) {
                                                if (grouplen[depth] === 1) {
                                                    console.log(tab.slice(tablen) + "\x1B[31mThe test failed" + groupn + "\x1B[39m");
                                                } else {
                                                    console.log(tab.slice(tablen) + "\x1B[31mAll " + grouplen[depth] + " tests failed" + groupn + "\x1B[39m");
                                                }
                                            } else {
                                                fgroup  += 1;
                                                fail    = complete[depth] - passcount[depth];
                                                failper = (fail / grouplen[depth]) * 100;
                                                if (fail === 1) {
                                                    plural = "";
                                                } else {
                                                    plural = "s";
                                                }
                                                console.log(tab.slice(tablen) + "\x1B[31m" + fail + "\x1B[39m test" + plural + " (" + failper.toFixed(0) + "%) failed of \x1B[32m" + complete[depth] + "\x1B[39m tests" + groupn + ".");
                                            }
                                        }
                                        teardowns.pop();
                                        grouplen.pop();
                                        groupname.pop();
                                        passcount.pop();
                                        complete.pop();
                                        units.pop();
                                        index.pop();
                                        depth -= 1;
                                        if (depth > -1) {
                                            tab             = tab.slice(tablen);
                                            complete[depth] += 1;
                                            groupn          = " for group: \x1B[39m\x1B[33m" + groupname[depth] + "\x1B[39m";
                                            if (groupPass === true) {
                                                passcount[depth] += 1;
                                            }
                                            if (complete[depth] < grouplen[depth]) {
                                                index[depth] += 1;
                                                if (units[depth][index].group !== undefined) {
                                                    shell(units[depth][index]);
                                                } else {
                                                    child(units[depth][index]);
                                                }
                                            }
                                        } else {
                                            console.log("\n\nAll tests complete.");
                                            plural = (total === 1)
                                                ? ""
                                                : "s";
                                            totaln = (fails === 1)
                                                ? ""
                                                : "s";
                                            groupn = (fgroup === 1)
                                                ? ""
                                                : "s";
                                            status = (gcount === 1)
                                                ? ""
                                                : "s";
                                            if (fails === 0) {
                                                console.log("\x1B[32mPassed all " + total + " test" + plural + " from all " + gcount + " groups.\x1B[39m");
                                            } else if (fails === total) {
                                                console.log("\x1B[31mFailed all " + total + " test" + plural + " from all " + gcount + " groups.\x1B[39m");
                                            } else {
                                                console.log("\x1B[31mFailed " + fails + " test" + totaln + " from " + fgroup + " group" + groupn + "\x1B[39m out of " + total + " total tests across " + gcount + " group" + status + ".");
                                            }
                                            return stdout;
                                        }
                                        if (depth > -1 && complete[depth] === grouplen[depth]) {
                                            groupComplete();
                                        }
                                    },
                                    teardown      = function testrunner__shell_child_writeLine_teardown(tasks) {
                                        var a    = 0,
                                            len  = tasks.length,
                                            task = function testrunner__shell_child_writeLine_teardown_task() {
                                                console.log(tab + "  " + tasks[a]);
                                                childExec(tasks[a], function testrunner__shell_child_writeLine_teardown_task_exec(err, stdout, stderr) {
                                                    a += 1;
                                                    if (typeof err === "string") {
                                                        console.log(err);
                                                    } else if (typeof stderr === "string" && stderr !== "") {
                                                        console.log(stderr);
                                                    } else {
                                                        if (a === len) {
                                                            console.log(tab + "\x1B[36mTeardown\x1B[39m for group: \x1B[33m" + groupname[depth] + "\x1B[39m \x1B[32mcomplete\x1B[39m.\n");
                                                            groupEnd();
                                                            return stdout;
                                                        }
                                                        task();
                                                    }
                                                });
                                            };
                                        console.log("\n" + tab + "\x1B[36mTeardown\x1B[39m for group: \x1B[33m" + groupname[depth] + "\x1B[39m \x1B[36mstarted\x1B[39m.");
                                        task();
                                    },
                                    groupComplete = function testrunner__shell_child_writeLine_groupComplete() {
                                        if (teardowns[depth].length > 0) {
                                            teardown(teardowns[depth]);
                                        } else {
                                            groupEnd();
                                        }
                                    };
                                complete[depth] += 1;
                                if (single === false && complete[depth] === 1) {
                                    if (depth === 0) {
                                        console.log("\n" + tab.slice(tablen) + "\x1B[36mTest group: \x1B[39m\x1B[33m" + groupname[depth] + "\x1B[39m");
                                    } else {
                                        console.log("\n" + tab.slice(tablen) + "Test unit " + (complete[depth - 1] + 1) + " of " + grouplen[depth - 1] + ", \x1B[36mtest group: \x1B[39m\x1B[33m" + groupname[depth] + "\x1B[39m");
                                    }
                                }
                                console.log(tab + item[0]);
                                console.log(tab + status + complete[depth] + " of " + grouplen[depth] + totaln);
                                if (item[1] !== "pass") {
                                    fails += 1;
                                    console.log(tab + item[2]);
                                }
                                if (complete[depth] === grouplen[depth]) {
                                    groupComplete();
                                } else if (units[complete[depth]] !== undefined && units[complete[depth]].group !== undefined) {
                                    shell(units[complete[depth]]);
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
                            passcount[depth] += 1;
                            data.push("pass");
                            data.push(stdout);
                        }
                        total += 1;
                        writeLine(data);
                    });
                },
                buildup   = function testrunner__shell_buildup(tasks) {
                    var a    = 0,
                        len  = tasks.length,
                        task = function testrunner__shell_buildup_task() {
                            console.log(tab + "  " + tasks[a]);
                            childExec(tasks[a], function testrunner__shell_buildup_task_exec(err, stdout, stderr) {
                                a += 1;
                                if (typeof err === "string") {
                                    console.log("\x1B[31mError:\x1B[39m " + err);
                                    console.log("Terminated early");
                                } else if (typeof stderr === "string" && stderr !== "") {
                                    console.log("\x1B[31mError:\x1B[39m " + stderr);
                                    console.log("Terminated early");
                                } else {
                                    if (a < len) {
                                        task();
                                    } else {
                                        console.log(tab + "\x1B[36mBuildup\x1B[39m for group: \x1B[33m" + testData.group + "\x1B[39m \x1B[32mcomplete\x1B[39m.");
                                        if (index[depth] === 0 && units[depth][index[depth]].group !== undefined) {
                                            shell(units[depth][index[depth]]);
                                            return stdout;
                                        }
                                        for (index[depth] = index[depth]; index[depth] < grouplen[depth]; index[depth] += 1) {
                                            if (units[depth][index[depth]].group === undefined) {
                                                child(units[depth][index[depth]]);
                                                if (units[depth][index[depth] + 1] !== undefined && units[depth][index[depth] + 1].group !== undefined) {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        };
                    console.log("\n" + tab + "\x1B[36mBuildup\x1B[39m for group: \x1B[33m" + testData.group + "\x1B[39m \x1B[36mstarted\x1B[39m.");
                    task();
                };
            passcount.push(0);
            if (single === false) {
                groupname.push(testData.group);
                complete.push(0);
                index.push(0);
                gcount += 1;
                depth  += 1;
                units.push(testData.units);
                units[depth].sort(unitsort);
                grouplen.push(units[depth].length);
                if (testData.teardown !== undefined && testData.teardown.length > 0) {
                    teardowns.push(testData.teardown);
                } else {
                    teardowns.push([]);
                }
                if (testData.buildup !== undefined && testData.buildup.length > 0) {
                    buildup(testData.buildup);
                } else if (index[depth] === 0 && units[depth][index[depth]].group !== undefined) {
                    shell(units[depth][index[depth]]);
                } else {
                    for (index[depth] = index[depth]; index[depth] < grouplen[depth]; index[depth] += 1) {
                        if (units[depth][index[depth]].group === undefined) {
                            child(units[depth][index[depth]]);
                            if (units[depth][index[depth] + 1] !== undefined && units[depth][index[depth] + 1].group !== undefined) {
                                break;
                            }
                        }
                    }
                }
            } else {
                grouplen.push(tests.length);
                child(testData);
            }
        };
    tests.sort(unitsort);
    if (tests[tests.length - 1].group === undefined) {
        single = true;
    }
    tests.forEach(shell);
}());
