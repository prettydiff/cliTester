cliTester
===

A project designed to run unit tests against command line tasks in the most primitive way possible.

How to run
---

    cd tester
    node testrunner.js myTestFile/Location.js

The file path argument is optional. If absent testrunner.js will look for a local ./tests.js.

Inventory
---

* testrunner.js
* test file

The primary application is contained in the testrunner.js while the things to test are contained in a test file. At this time only one test file is supported, but it is the intention to support multiple files in convenient and extensible way.

Tests Schema
---

The file must contain a variable named `tests` is an array. This array must contain more than 0 of either of the two:

* test groups
* test units

A test unit is an object comprised of three required properties:

* check - The command line instruction to issue
* name - A text label that describes the current check
* verify - The expected result. At this time only a string is accepted, but there are plans to accept functions so that additional command line instructions may be issued in the verification phase or so that flexible and complex analysis, such as regular expression, may be performed on the output.

A test group is an object comprised of the following properties:

* group (required) - The name of the test group
* buildup (optional) - Instructions to issue before executing test units, such as installing software or creating file system artifacts
* teardown (optional) - It is always best to tidy up and leave things as they were found to prevent interference from additional test runs.
* units (required) - An array comprising more than 0 of test units and/or test groups
