Start
 = "?" _ p:Prompt EOF { return p; }
 / EOF { return null; }

Prompt
 = question:Question ws EOF { return { question, type: 'input' }; }
 / question:Question response:Response { return { question, ...response }; }

Question
 = c:(!EOQ .)+ { return text().trim(); }

Response
 = _? response:(
     l:List     { return { type: 'list', ...l }; }
   / c:Checkbox { return { type: 'checkbox', ...c }; }
   / r:RawList  { return { type: 'rawlist', ...r }; }
   / e:Editor   { return { type: 'editor' }; }
   / c:Confirm  { return { type: 'confirm', default: c }; }
   / e:Expand   { return { type: 'expand', ...e }; }
   / i:Input    { return { type: 'input', default: i }; }
 ) EOL? scrollable:"(Move up and down to reveal more choices)"? ws {
   if (scrollable) {
     return { ...response, scrollable: true };
   } else {
     return { ...response };
   }
 }

Confirm
 = "(Y/n)" { return true; }
 / "(y/N)" { return false; }
 / "(y/n)" { return null; }

Input
 = "(" c:[^)]+ ")" { return c.join(''); }

Expand
 = "(" c:[^)Hh]+ h:[hH] ")" {
   const choices = c.concat(h);
   return {
   	default: choices.findIndex((c) => c === c.toUpperCase()),
   	choices
   };
 }

List
 = "(Use arrow keys)" choices:Choice+ {
   return {
     choices: choices.map((c) => {
       if (c.disabled) {
         return { disabled: true, value: c.value.replace('(Unavailable at this time)', '').trim() };
       } else {
       	 return c.value;
       }
     }),
     default: choices.findIndex((c) => c.default)
   };
 }

Checkbox
 = "(Press <space> to select, <a> to toggle all, <i> to inverse selection)" choices:SelectableChoice+ {
   return {
     choices: choices.map((c) => c.separator ? c : c.value),
     selected: choices.reduce((acc, c, i) => c.selected ? acc.concat(i) : acc, [])
   };
 }

RawList
 = choices:NumberedChoice+ {
   return {
     choices: choices.filter((c) => typeof c !== 'undefined' && !c.raw)
   };
 }

Editor
 = "Press <enter> to launch your preferred editor." ! { throw new Error('"editor" prompt type is not supported'); }

Choice
 = EOL "❯" _ value:Value { return { value: value.trim(), default: true }; }
 / EOL  _  _ "-" value:Value { return { value: value.trim(), disabled: true }; }
 / EOL  _  _ value:Value { return { value: value.trim(), default: false }; }

SelectableChoice
 = EOL "❯" selected:checkbox _ value:Value { return { selected, value: value.trim() }; }
 / EOL  _  selected:checkbox _ value:Value { return { selected, value: value.trim() }; }
 / EOL  _                    _ value:Value { return { separator: value.trim() }; }

NumberedChoice
 = EOL _ _ number ")" _ value:Value { return value.trim(); }
 / EOL _ _ number ")" _ value:Value { return value.trim(); }
 / EOL _ _ "Answer:" ws { return undefined; }
 / EOL _ _ value:Value { return { separator: value.trim() }; }

Value
 = c:(!EOL .)+ { return text().trim(); }

number
 = d:digit+

digit
 = [0-9]

checkbox
 = "◉" { return true; }
 / "◯" { return false; }

EOQ "end of question"
 = EOL
 / _ &"("

EOL "end of line"
 = "\n"
 / "\r\n"
 / "\r"
 / "\u2028"
 / "\u2029"

_ "single space"
 = " "

ws "whitespace"
 = [ \t\n\r]*

EOF "end of file"
 = !.
