

/*var tests = [
    {
        check : "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
        name  : "Node command line input with readmethod screen. Beautify markup.",
        verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
    }, {
        check : "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
        name  : "Node command line input with readmethod screen. Minify markup.",
        verify: "<a><b> <c/> </b></a>"
    }, {
        check : "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
        name  : "Node command line input with readmethod screen. Parse markup.",
        verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
    }
];*/
var tests = [
    {
        group: "command line input",
        buildup: ["rm -rf node_modules","mkdir node_modules","npm install prettydiff"],
        teardown: ["rm -rf node_modules"],
        units: [
            {
                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
                name: "Base. Beautify markup.",
                verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
            }, {
                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
                name: "Base. Minify markup.",
                verify: "<a><b> <c/> </b></a>"
            }, {
                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
                name: "Base. Parse markup.",
                verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
            }, {
                group: "recursion test",
                units: [
                    {
                        group: "extra recursion test",
                        units: [
                            {
                                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
                                name: "Extra Recursion Beautify markup.",
                                verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
                            }, {
                                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
                                name: "Extra Recursion Minify markup.",
                                verify: "<a><b> <c/> </b></a>"
                            }, {
                                check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
                                name: "Extra Recursion Parse markup.",
                                verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
                            }
                        ]
                    },
                    {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
                        name: "Recursion Beautify markup.",
                        verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
                        name: "Recursion Minify markup.",
                        verify: "<a><b> <c/> </b></a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
                        name: "Recursion Parse markup.",
                        verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
                    }
                ]
            }
        ]
    }
];

/*var tests = [
    {
        group: "node-local",
        //buildup: ["rm -rf node_modules","mkdir node_modules","npm install prettydiff"],
        //teardown: ["rm -rf node_modules"],
        units: [
            {
                group: "readmethod screen",
                units: [
                    {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
                        name: "Node command line input with readmethod screen. Beautify markup.",
                        verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
                        name: "Node command line input with readmethod screen. Minify markup.",
                        verify: "<a><b> <c/> </b></a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
                        name: "Node command line input with readmethod screen. Parse markup.",
                        verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
                    }
                ]
            }
        ]
    }
];*/

exports.tests = tests;
