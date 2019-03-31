# JS Simple Rule Engine

Very basic rule engine library fully developed in JavaScript. No installation needed. It uses reflexion (eval), hence is highly unsafe for any production environment.
Using reflection, it allows you to make inferences in Rules.

## Getting Started
To use it, you will need to import the following file:
*/JSObjects/rule.js"></script>
        
The following two modules may help for visualization. They require the use of jQuery
* /JSObjects/guiFacts.js
* /JSObjects/guiRule.js

Then, you will need to create a fact set and a rule set.
Facts:
```javascript
  var facts = {
    'fact01':{
      'feature01':1,
      'feature02':5
     },
    'fact02':{
      'feature01':10,
      'feature02':2
     }
  };
```
Rules
```javascript
  var condition = "F.feature01 >= 5",
      reaction = "F.feature02 += 1";
  var rule = new Rule(condition, reaction);
```
Inference:
```javascript
  rule.execute(facts, {'F':facts.fact01});
```

