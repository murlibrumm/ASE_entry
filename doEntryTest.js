// // ============  REQUIRES & VARIABLE DECLARATIONS ============
// https://www.sitepoint.com/making-http-requests-in-node-js/
var request = require("request");
var startUrl = "http://localhost:8080/assignment/stage/1/testcase/1";
// from http://stackoverflow.com/questions/13077923/how-can-i-convert-a-string-into-a-math-operator-in-javascript
var math_it_up = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '*': function (x, y) { return x * y }
};

// ============  "MAIN" ============
// send the first request
sendGetRequest(startUrl);


// ============  GET / POST FUNCTIONS ============
function sendGetRequest (url) {
    console.log("getRequestUrl " + url);
    request({
        uri: url,
        method: "GET",
        timeout: 10000
    }, function(error, response, body) {
        // log body
        console.log("getRequestBody " + body);

        // response is json
        var jsonObject = getJSONFrom(body);

        // url structure: http://localhost:8080/assignment/stage/2/testcase/<testcase>
        // get the stage number, parse it to integer
        var stage = parseInt(url.substr("http://localhost:8080/assignment/stage/".length, 1));
        var solution;
        switch (stage) {
            case 1:
                solution = invertNumber(jsonObject.number);
                break;
            case 2:
                solution = addNumbers(jsonObject.a, jsonObject.b);
                break;
            case 3:
                solution = calculateArrayWithOperator(jsonObject.numbers, "+");
                break;
            case 4:
                solution = calculateArrayWithOperator(jsonObject.numbers, jsonObject.operator);
                break;
        }

        sendPostResponse(solution, url);
    });
}

function sendPostResponse (solution, url) {
    request({
        uri: url,
        method: "POST",
        json: {
            solution: solution
        }
    }, function(error, response, body) {
        // log body
        console.log("postResponseBody " + body);

        // response is JSON
        var jsonObject = getJSONFrom(body);

        if (jsonObject.message == "Accepted") {
            url = jsonObject.linkToNextTask;
            if (typeof url != 'undefined') {
                sendGetRequest(url);
            } else {
                console.log ("finished all test cases!");
            }
        }

    });
}

// ============  CALCULATIONS ============
function invertNumber(x) {
    return x * (-1);
}

function addNumbers(a, b) {
    return a + b;
}

function calculateArrayWithOperator(numbers, operator) {
    var sum = numbers[0];
    for (var i = 1; i < numbers.length; i++) {
        sum = math_it_up[operator](sum, numbers[i]);
    }
    return sum;
}

// ============  HELPER FUNCTIONS ============
// from http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

function getJSONFrom (x) {
    var jsonObject = x;
    if (isString(jsonObject)) {
        jsonObject = JSON.parse(jsonObject);
    }
    return jsonObject;
}