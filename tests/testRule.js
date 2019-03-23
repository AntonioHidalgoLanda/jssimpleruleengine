/*jslint devel: true */
/* eslint-disable no-console */

/*global Rule*/

/*global
console
*/

var printRule = function (facts, rule) {
    "use strict";
    console.log("Fatcs:");
    console.log(JSON.stringify(facts));
    console.log("Rule:");
    console.log(JSON.stringify(rule));
    
};

var condition = "";
var reaction = "";
var fact = {};

fact.test001_0A = {"value": 2, "message": ""};
fact.test001_0B = {"value": 7, "message": ""};
fact.test001_0D = {"value": 17, "message": ""};
fact.test001_0E = {"value": 5, "message": ""};
fact.test001_0F = {"value": 9, "message": ""};
fact.msg = {"msg_rule_triggered": "Rule Triggered"};


// Test 1
condition = "P.value == \"5\"";
reaction = "P.message = \"rule triggered\"";
console.log("#test: Rule(" + condition + ", " + reaction + ")");
var rule = new Rule(condition, reaction);
printRule(fact, rule);
console.log(rule.condition === "");
console.log(rule.reaction === "");


condition = "P.value = 5";
console.log("#test: Rule(" + condition + ", " + reaction + ")");
rule.setCondition(condition);
printRule(fact, rule);
console.log(rule.condition === "");


condition = "P.value >= 5";
reaction = "P.message = msg.msg_rule_triggered";
console.log("#test: Rule(" + condition + ", " + reaction + ")");
rule.setCondition(condition).setReaction(reaction);
printRule(fact, rule);
console.log(rule.condition !== "");
console.log(rule.reaction !== "");
console.log(rule.extractTargets());




console.log("#Execution: P: fact.test001_0A, msg: fact.msg");
printRule(fact, rule);
rule.execute(fact, {"P": fact.test001_0A, "msg": fact.msg});
printRule(fact, rule);


console.log("#Execution: P: fact.test001_0B, msg: fact.msg");
printRule(fact, rule);
rule.execute(fact, {"P": fact.test001_0B, "msg": fact.msg});
printRule(fact, rule);



