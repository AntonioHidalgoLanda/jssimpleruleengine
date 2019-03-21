/* This code requires serious refactoring */
/*jslint devel: true */
/* eslint-disable no-console */

/*global
console
*/
function Rule (strCondition, strReaction) {
    // private variables (TODO - make them private)
    this.condition;
    this.reaction;
    
    // Static variables
    this.regExAssignation = /[^<>=]=[^=<>]/gm;
    this.regExQuote = new RegExp("\"+","gm"); //("\"*","gm")
    this.regExScope = new RegExp("[A-Za-z]([\\.]*\\w)*","gm");
    this.replaceScope = "scope.$&";
    
    this.target = [];
    
    // creation logic
    this.setCondition(strCondition);
    this.setReaction(strReaction);
}

Rule.prototype.setCondition = function (str) {
    this.condition = "";
    if (this.regExAssignation.test(str)) {
        console.log("Rule conditionscannot use assignations.");
        return this;
    }
    
    // Don't tolerate strings, strings will be part of facts
    if (this.regExQuote.test(str)) {
        console.log("Rule conditions and reaction cannot use quotes.");
        return this;
    }
    this.condition = str.replace(this.regExScope,this.replaceScope);
    
    return this;
}

Rule.prototype.setReaction = function (str) {
    // Don't tolerate strings, strings will be part of facts
    this.reaction = "";
    if (this.regExQuote.test(str)) {
        console.log("Rule conditions and reaction cannot use quotes.");
        return this;
    }
    
    this.reaction = str.replace(this.regExScope,this.replaceScope);
    
    return this;
}

Rule.prototype.execute = function (facts, candidate) {
    var candidates;
    if (candidate) {
        candidates = [];
        candidates.push(candidate);
    }
    else {
        candidates = this.getCandidates(facts);
    }
    
    for (var item in candidates) {
        var scope = {};                 // clean up any scope variable// scope = []
        this.assignTargets(candidates[item], scope);   // scope[target] = candidate[target] || break
        if (eval(this.condition)) {
                eval(this.reaction);
                this.committ(facts, scope);       // candidate[target] = scope[target]
        }
            
    }
    return this;
};

Rule.isCandidate = function (fact, target) {
    for (var attribute in target){
        if (!fact.hasOwnProperty(target[attribute])){
            return false;
        }
    }
    return true;
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

// Not working - Creates duplicates....
Rule.prototype.getCandidates = function(facts){
    var targets = this.extractTargets();    // All the different entities in rule.condition and rule.reaction
    // All possible combinations for the target of that rule
    var candidates = [];
    var candidate = {};
    for (var target in targets){
        var attributes = targets[target];
        for (var itemName in facts) {
            var item = facts[itemName];
            if (Rule.isCandidate(item, attributes)){
                candidate[target] = item;
                
                // if lenghs are right
                if (Object.keys(candidate).length >= Object.keys(targets).length) {
                    candidates.push(candidate);
                    candidate=candidate.deepCopy();  //NOT Implemented
                    console.log(this);
                    console.log("not implemented");
                }
            }
        }
        // remove target from candidates
    }
    return candidates;
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
                    if (!this.target[targetName].hasOwnProperty(attribute)){
                        this.target[targetName].push(attribute);
                    }
                }
            }
        } while (m);
    }
    
    return this.target;
};

