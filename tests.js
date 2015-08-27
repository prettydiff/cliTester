var tests = [
    {
        group: "lib node-local.js",
        buildup: ["rm -rf node_modules","mkdir node_modules","npm install prettydiff", "echo \"<a><b> <c/>    </b></a>\" > node_modules/prettydiff/testa.txt", "echo \"<a><b> <d/>    </b></a>\" > node_modules/prettydiff/testb.txt"],
        teardown: ["rm -rf node_modules"],
        units: [
            {
                group: "readmethod: screen",
                units: [
                    {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"beautify\"\n",
                        name: "Beautify markup.",
                        verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"minify\"\n",
                        name: "Minify markup.",
                        verify: "<a><b> <c/> </b></a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"<a><b> <c/>    </b></a>\" readmethod:\"screen\" mode:\"parse\"\n",
                        name: "Parse markup.",
                        verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
                    }
                ]
            },
            {
                group: "readmethod: filescreen",
                units: [
                    {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"node_modules/prettydiff/testa.txt\" readmethod:\"filescreen\" mode:\"beautify\"\n",
                        name: "Beautify markup.",
                        verify: "<a>\n    <b>\n        <c/>\n    </b>\n</a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"node_modules/prettydiff/testa.txt\" readmethod:\"filescreen\" mode:\"minify\"\n",
                        name: "Minify markup.",
                        verify: "<a><b> <c/> </b></a>"
                    }, {
                        check: "node node_modules/prettydiff/api/node-local.js source:\"node_modules/prettydiff/testa.txt\" readmethod:\"filescreen\" mode:\"parse\"\n",
                        name: "Parse markup.",
                        verify: "{\"token\":[\"<a>\",\"<b>\",\" \",\"<c/>\",\" \",\"</b>\",\"</a>\"],\"types\":[\"start\",\"start\",\"content\",\"singleton\",\"content\",\"end\",\"end\"]}"
                    }
                ]
            }
        ]
    }
];

//4256 - push beta
//4888 - new bug
//4889 - new bug
//4890 = new bug


exports.tests = tests;
