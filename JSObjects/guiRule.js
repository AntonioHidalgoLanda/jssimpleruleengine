/*jslint devel: true */
/* eslint-disable no-console */

/*global jQuery*/

/*
Please override RuleGUI.prototype.factToDiv = function (fact)
and add a CSS.
*/

function RuleGUI(rule, facts, div, predefined) {
    "use strict";
    
    this.div = div;
    this.divFacts = null;
    this.divTargets = null;
    this.candidate = [];
    this.rule = rule;
    this.facts = facts;
    this.predefined = predefined;
    this.ruleToDiv();
    this.factsToDiv();
    this.targetsToDiv();
}


RuleGUI.prototype.factsToSelectbox = function (target, selectbox) {
    "use strict";
    var arr = this.rule.getCandidatesFor(this.facts, target);
    jQuery(arr).each(function() {
        selectbox.append(jQuery("<option>").attr('value',this).text(this));
    });
};

RuleGUI.prototype.targetsToDiv = function () {
    "use strict";
    var target,
        targets = this.rule.extractTargets();
    this.candidate = [];
    if (this.divTargets !== null) {
        this.divTargets.empty();
    }
    
    for (target in targets) {
        if (this.predefined.hasOwnProperty(target)) {
            this.candidate[target] = this.predefined[target];
        } else {
            var selectbox = jQuery('<select>', {
                    id: 'select-' + target + '-rgui',
                    class: 'select-' + target + '-rgui'  
                });
            selectbox.on('change', handlerSelectTarget(this.candidate, this.facts, target));
            this.divTargets.append(target);
            this.divTargets.append(selectbox);
            this.factsToSelectbox(target, selectbox);
            var currentValue = selectbox.find(":selected").val();
            this.candidate[target] = this.facts[currentValue];
        }
    }
    
    this.divTargets.append(jQuery('<button/>',
            {
                text: 'Execute',
                click: handlerExecuteRule(this.rule, this.facts, this.candidate, this)
            }));
};


RuleGUI.prototype.ruleToDiv = function () {
    "use strict";
    this.div.empty();
    // print condition
    this.div.append(
        jQuery('<div/>', {
            id: 'condition-rgui',
            class: 'condition-rgui',
            title: 'condition',
            text: this.rule.condition
        })
    );
    // print reaction
    this.div.append(
        jQuery('<div/>', {
            id: 'reaction-rgui',
            class: 'reaction-rgui',
            title: 'reaction',
            text: this.rule.reaction
        })
    );
    
    this.divFacts = jQuery('<div/>', {
            id: 'facts-rgui',
            class: 'fats-rgui',
            title: 'facts'
        });
    this.div.append(this.divFacts);
    
    this.divTargets = jQuery('<div/>', {
            id: 'targets-rgui',
            class: 'targets-rgui',
            title: 'targets'
        });
    this.div.append(this.divTargets);
    
};

RuleGUI.prototype.factsToDiv = function (facts) {
    "use strict";
    if (this.divFacts !== null) {
        this.divFacts.empty();
    }
    if (facts !== null && facts !== undefined) {
        this.facts = facts;
    }
    for (var fact in this.facts) {
        var divFact = jQuery('<div/>', {
                id: 'fact-rgui',
                class: 'fact-rgui',
                title: 'fact'
            });
        divFact.append(jQuery('<div/>', {
                id: 'fact-id-rgui',
                class: 'fact-id-rgui',
                title: 'fact id',
                text: fact
            }));
        divFact.append(this.factToDiv(fact));
        this.divFacts.append(divFact);
    }
};

RuleGUI.prototype.factToDiv = function (fact) {
    return jQuery('<div/>', {
                id: 'fact-id-rgui',
                class: 'fact-rgui',
                title: 'fact body',
                text: JSON.stringify(this.facts[fact])
            });
};


var handlerSelectTarget = function (candidate, facts, target) {
    return function () {
            var currentValue = this.options[this.selectedIndex].value;
            candidate[target] = facts[currentValue];
    };
};

var handlerExecuteRule = function (rule, facts, candidate, divRule) {
    "use strict";
    return function () {
        
        rule.execute(facts, candidate);
        
        divRule.factsToDiv();
        // divRule.targetsToDiv(); We don't need so far, don't add it.
        
    };
};
