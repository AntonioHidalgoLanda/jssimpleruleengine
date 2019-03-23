/*jslint devel: true */
/* eslint-disable no-console */

/*global jQuery, FactsGUI */

/*
Please override RuleGUI.prototype.factToDiv = function (fact)
and add a CSS.
*/

function RuleGUI(rule, facts, div, predefined) {
    "use strict";
    
    this.div = div;
    this.guiFacts = new FactsGUI(facts, null);
    this.divTargets = null;
    this.candidate = [];
    this.rule = rule;
    this.predefined = predefined;
    this.ruleToDiv();
    this.targetsToDiv();
}


RuleGUI.prototype.factsToSelectbox = function (target, selectbox) {
    "use strict";
    var arr = this.rule.getCandidatesFor(this.guiFacts.facts, target);
    jQuery(arr).each(function () {
        selectbox.append(jQuery("<option>").attr('value', this).text(this));
    });
};

RuleGUI.prototype.targetsToDiv = function () {
    "use strict";
    var target,
        targets = this.rule.extractTargets(),
        selectbox,
        currentValue;
    this.candidate = [];
    if (this.divTargets !== null) {
        this.divTargets.empty();
    }
    
    for (target in targets) {
        if (this.predefined.hasOwnProperty(target)) {
            this.candidate[target] = this.predefined[target];
        } else {
            selectbox = jQuery('<select>', {
                id: 'select-' + target + '-rgui',
                class: 'select-' + target + '-rgui'
            });
            selectbox.on('change', handlerSelectTarget(this.candidate, this.guiFacts.facts, target));
            this.divTargets.append(target);
            this.divTargets.append(selectbox);
            this.factsToSelectbox(target, selectbox);
            currentValue = selectbox.find(":selected").val();
            this.candidate[target] = this.guiFacts.facts[currentValue];
        }
    }
    
    this.divTargets.append(jQuery('<button/>',
            {
            text: 'Execute',
            click: handlerExecuteRule(this.rule, this.guiFacts.facts, this.candidate, this)
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
    
    this.guiFacts.divFacts = this.divFacts;
    this.guiFacts.factsToDiv();
};


var handlerSelectTarget = function (candidate, facts, target) {
    "use strict";
    return function () {
        var currentValue = this.options[this.selectedIndex].value;
        candidate[target] = facts[currentValue];
    };
};

var handlerExecuteRule = function (rule, facts, candidate, divRule) {
    "use strict";
    return function () {
        
        rule.execute(facts, candidate);
        
        divRule.guiFacts.factsToDiv();
        
    };
};
