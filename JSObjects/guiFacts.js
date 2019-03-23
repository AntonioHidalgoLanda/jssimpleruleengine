/*jslint devel: true */
/* eslint-disable no-console */

/*global jQuery*/

/*
Please override FactsGUI.prototype.factToDiv = function (fact)
and add a CSS.
*/


function FactsGUI(facts, div) {
    "use strict";
    
    this.divFacts = div;
    this.facts = facts;
    this.factsToDiv();
}


FactsGUI.prototype.factsToDiv = function (facts) {
    "use strict";
    if (this.divFacts !== null && this.divFacts !== undefined) {
        this.divFacts.empty();
    } else {
        return this;
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
    return this;
};

FactsGUI.prototype.factToDiv = function (fact) {
    "use strict";
    return jQuery('<div/>', {
                id: 'fact-id-rgui',
                class: 'fact-rgui',
                title: 'fact body',
                text: JSON.stringify(this.facts[fact])
            });
};
