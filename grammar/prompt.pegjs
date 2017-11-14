Prompt
 = "?" _ question:Question "?" response:Response ws {
   return { question, ...response };
 }

Question
 = c:[^?]+ { return c.join(''); }

Response
 = _ response:(
     l:List     { return { type: 'list', ...l }; }
   / c:Checkbox { return { type: 'checkbox', ...c }; }
   / r:RawList  { return { type: 'rawlist', ...r }; }
   / p:Password { return { type: 'password', ...p }; }
   / e:Editor   { return { type: 'editor', ...e }; }
   / c:Confirm  { return { type: 'confirm', default: c }; }
   / e:Expand   { return { type: 'expand', ...e }; }
   / i:Input    { return { type: 'input', default: i }; }
 ) { return response; }
 // default response
 / "" { return { type: 'input' }; }

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
     choices: choices.map((c) => c.value.trim()),
     default: choices.findIndex((c) => c.default)
   };
 }

Checkbox
 = (
 	"(Press <space> to select, <a> to toggle all, <i> to inverse selection)"
    / "(Press <space> to select, <a> " eol "to toggle all, <i> to inverse selection)"
 ) choices:Choice+ {
   return {
     choices: choices.map((c) => c.value.trim()),
     selected: choices.reduce((acc, c, i) => c.selected ? acc.concat(i) : acc, [])
   };
 }

RawList
 = "todo"

Password
 = "todo"

Editor
 = "todo"

Choice
 = eol "❯" _ value:Value { return { value, default: true }; }
 / eol _ _ value:Value { return { value, default: false }; }
 / eol ("❯"/_) selected:checkbox _ value:Value { return { selected, value }; }

Value
 = c:[^\n\r]+ { return c.join(''); }

checkbox
 = "◉" { return true; }
 / "◯" { return false; }

eol "end of line"
 = [\n\r]

_ "single space"
 = " "

ws "whitespace"
 = [ \t\n\r]*
