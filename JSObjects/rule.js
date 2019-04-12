/* This code requires serious refactoring */
/*jslint devel: true */
/* eslint-disable no-console */

/*global
console
*/
function Rule(strCondition, strReaction) {
    // private variables (TODO - make them private)
    this.condition;
    this.reaction;
    
    // Static variables
    
    this.target = [];
    
    // creation logic
    this.setCondition(strCondition);
    this.setReaction(strReaction);
}

Rule.regExAssignation = /[^<>=]=[^=<>]/gm;
Rule.regExQuote = new RegExp("\"+", "gm"); //("\"*","gm")
Rule.regExScope = new RegExp("[A-Za-z]([\\.]*\\w)*", "gm");
Rule.replaceScope = "scope.$&";

Rule.prototype.setCondition = function (str) {
    this.condition = "";
    if (Rule.regExAssignation.test(str)) {
        console.log("Rule conditionscannot use assignations.");
        return this;
    }
    
    // Don't tolerate strings, strings will be part of facts
    if (Rule.regExQuote.test(str)) {
        console.log("Rule conditions and reaction cannot use quotes.");
        return this;
    }
    this.condition = str.replace(Rule.regExScope, Rule.replaceScope);
    
    return this;
};

Rule.prototype.setReaction = function (str) {
    // Don't tolerate strings, strings will be part of facts
    this.reaction = "";
    if (Rule.regExQuote.test(str)) {
        console.log("Rule conditions and reaction cannot use quotes.");
        return this;
    }
    
    this.reaction = str.replace(Rule.regExScope, Rule.replaceScope);
    
    return this;
};

Rule.prototype.execute = function (facts, candidate) {
    var candidates;
    if (candidate) {
        candidates = [];
        candidates.push(candidate);
    } else {
        candidates = this.getCandidates(facts);
    }
    
    for (var item in candidates) {
        var scope = {};                                 // clean up any scope variable// scope = []
        this.assignTargets(candidates[item], scope);    // scope[target] = candidate[target] || break
        if (eval(this.condition)) {
                eval(this.reaction);
                this.committ(facts, scope);             // candidate[target] = scope[target]
        }
            
    }
    return this;
};

Rule.isCandidate = function (fact, target) {
    for (var attribute in target){
        if (!fact.hasOwnProperty(target[attribute]) && typeof fact[target[attribute]] !== "function"){
            return false;
        }
    }
    return true;
};

Rule.prototype.isValidCandidate = function (candidate) {
    var scope = {};                 // clean up any scope variable// scope = []
    for (var target in this.target) {
        if (!candidate.hasOwnProperty(target)) {
            return false;
        }
    }
    this.assignTargets(candidate, scope);
    return eval(this.condition);
};

Rule.prototype.getCandidatesFor = function(facts, targetName) {
    var arr = [];
    if (this.target.length === 0) {
        this.extractTargets();
    }
    var attribute = this.target[targetName];
    for (var fact in facts) {
        if (Rule.isCandidate(facts[fact], attribute)) {
            arr.push(fact);
        }
    }
    return arr;
}

Rule.prototype.recursiveDFSCandidates = function (candidate, targetedFacts, facts) {
    var target, factid, candidates = [];
    if (Object.keys(candidate).length >= Object.keys(targetedFacts).length) {
        if (this.isValidCandidate(candidate)) {
            candidates.push(candidate);
            return candidates;
        } else {
            return [];
        }
    }
    for (target in targetedFacts) {
        if (targetedFacts.hasOwnProperty(target) && !candidate.hasOwnProperty(target)) {
            for (factid in targetedFacts[target]) {
                if (targetedFacts[target].hasOwnProperty(factid)) {
                    candidate[target] = facts[targetedFacts[target][factid]];
                    candidates = candidates.concat(
                        this.recursiveDFSCandidates(Object.assign({}, candidate), targetedFacts, facts)
                    );
                }
            }
            return candidates;
        }
    }
    return candidates;
};

Rule.prototype.getCandidates = function (facts, preDefined) {
  
    var targets = this.extractTargets(),
        targetedFacts = {},
        candidate = Object.assign({"Math": Math},preDefined),
        target;
    
    for (target in targets) {
        if (targets.hasOwnProperty(target)) {
            targetedFacts[target] = this.getCandidatesFor(facts, target);
        }
    }
    
    return this.recursiveDFSCandidates(candidate, targetedFacts, facts);
};

Rule.prototype.assignTargets = function(candidate, scope){
    for (var target in candidate) {
        scope[target] = candidate[target];
    }
    return this;
};

Rule.prototype.committ = function(facts, scope){
    for (var target in facts) { //scope
        if (scope.hasOwnProperty(target)) {
            facts[target] = scope[target];
        }
    }
    return this;
};


// All the different entities in rule.condition and rule.reaction
// Use RegEx to get anything with the form scope.XXXXX
Rule.prototype.extractTargets = function(){
    var regExTargets = /scope\.\w+/gm;
    this.target = {};
    var m;
    var allString = this.condition + " " + this.reaction;
    do {
        m = regExTargets.exec(allString);
        
        if (m) {
            var targetName = m[0].split(".")[1];    //grabbing only the right side after scope.
            if (!this.target.hasOwnProperty(targetName)) {
                this.target[targetName] = [];
            }
        }
    } while (m);
    
    for (targetName in this.target){
        var reAttributes = new RegExp("scope\\."+targetName+"\\.\\w+","gm");
        do {
            m = reAttributes.exec(allString);
            if (m) {
                var attribute = m[0].split(".")[2];    //grabbing only the right side after scope.
                if (attribute !== null && this.target.hasOwnProperty(targetName)) {
                    if (this.target[targetName].indexOf(attribute) < 0){
                        this.target[targetName].push(attribute);
                    }
                }
            }
        } while (m);
    }
    
    return this.target;
};

