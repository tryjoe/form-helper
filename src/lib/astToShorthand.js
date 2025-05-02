export const astToShorthand = comps => {
  let str = "";
  comps.forEach(comp => {
    if(comp.type == "non-input") {
      str = str + comp.element + "\n"
      if(comp.content) {
        str = str + "  " + comp.content + "\n"
      }
      str = str + "\n"
    }
    if(comp.type == "unknown") str = str + comp.value + "\n\n"
    if(comp.type == "input") {
      str = str + comp.element + "\n";
      if(comp.fields && comp.fields.length > 0 && comp.fields[0] != null) str = str + `  ${comp.fields.join(' ')}\n`
      else str = str + '  .\n'
      if(comp.label) str = str + `  ${comp.label}\n`
      else str = str + '  .\n'
      if(comp.choiceName) str = str + `  ${comp.choiceName}\n`
      if(comp.choices) {
        Object.entries(comp.choices).forEach(([key, label]) => {
          str = str + `    ${key} ${label}\n`
        });
      }
      str = str + '\n'
    }
  })
  return str;
}