
export const renderSvelte = (ast, withReadout = true) => {
  if(!ast) return '';
  const imports = new Set();
  const choiceDefinitions = [];
  ast.forEach(comp => {
    if(comp.type == 'input') imports.add(`import ${comp.element} from "@v2/inputs/${comp.element}.svelte";`);
    if(comp.type == 'non-input') imports.add(`import ${comp.element} from "@v2/components/${comp.element}.svelte";`)
    if(comp.choiceName && comp.choices) {
      const json = JSON.stringify(comp.choices, null, '  ').replaceAll("\n", "\n  ")
      choiceDefinitions.push(`  const ${comp.choiceName} = ${json};`);
    }
  })
  const sortedImports = Array.from(imports).sort()
  const readoutDefinition = `let readout = false;
  $: input = { readout, store };`;

  const svelteScript = `<script>
  import { moddable } from "@v2/stores/moddable.js";
  ${sortedImports.join("\n  ")}

  const store = moddable({});
  ${withReadout ? readoutDefinition : '$: input = { store };'}
  ${choiceDefinitions? '\n' +choiceDefinitions.join("\n"):''}
</script>
`;
  const components = ast.map(comp => {
    if(comp.type == "unknown") return `<!-- unknown component: ${comp.value} -->`
    else if(comp.type == "input") {
      let label = '';
      if(comp.label) {
        if(comp.label == '.') label = " label={/** TODO: label **/}"
        else label=` label="${comp.label}"`;
      }
      let fields = '';
      if(comp?.fields?.length == 1) {
        if(comp.fields[0] == '.') fields = " field={/** TODO: field **/}"
        else fields = ` field="${comp.fields[0]}"`;
      }
      let choices = '';
      if(comp?.choiceName) choices=` choices={${comp.choiceName}}` 
      if(comp?.fields && comp.fields.length > 1) fields = ` field={[${comp.fields.map(field => `"${field}"`).join(", ")}]}`
      let tag = `<${comp.element}${label}${fields}${choices} {...input} />`;
      if(tag.length > 78) {
        tag = `<${comp.element}
 ${label}
 ${fields}${choices == ''?'':'\n '+choices}
  {...input}
/>`;
      }
      return tag
    } else if(comp.type == "non-input") {
      const content = comp.content? comp.content : "<!-- missing content -->"
      const readout = withReadout? " {readout}":"";
      let tag = `<${comp.element}${readout}>${content}</${comp.element}>`;
      if(tag.length > 78) tag = `<${comp.element}${readout}>\n  ${content}\n</${comp.element}>`;
      return tag;
    }
  })
  return svelteScript + "\n" + components.join('\n');
}