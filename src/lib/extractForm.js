import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { ancestor, simple, base} from 'acorn-walk'
import { extend } from 'acorn-jsx-walk';
import staticClassFeatures from 'acorn-static-class-features';

const parser = Parser.extend(jsx(), staticClassFeatures);
extend(base)

const inputMapping = {
  'input/checkbox': 'YesNo',
  'input/text': 'TextInput',
  'input/date': 'DateInput',
  'input/number': 'NumberInput',
  'input/password': 'TextInput',
  'input/email': 'TextInput',
  'input/textarea': 'Textarea',
  'input/experimental': 'TextInput',
  'select': 'Select'
}

export const extractFields = src => {
  const jsxAst = parser.parse(src, {sourceType: "module"});
  const comps = [];
  simple(jsxAst, {
    JSXElement(node) {
      if(node?.openingElement?.name?.name == "Form") {
        extractForm(src, node, comps)
      }
    },
    base
  })
  console.log(comps)
  return comps
}

const extractForm = (src, formAst, comps) => {
  ancestor(formAst, {
    JSXElement(node, _, ancestors) {
      const nodeElement = node?.openingElement?.name?.name;
      const attributes = node.openingElement?.attributes;
      if(!attributes) return;
      if(nodeElement == "Label") {
        const { label } = extractAttributes(attributes, ["label"]);
        console.log(attributes)
        console.log(label)
        if(label) {
          comps.push({
            type: "non-input",
            element: "Prompt",
            content: label
          })
        }
      }
      if(nodeElement == "Field") {
        const {field, name: label, type: inputType} = extractAttributes(attributes, ["field","name","type"])
        let flags = null;
        if(inputType == "input/email") flags = ["email"]
        if(inputType == "input/password") flags = ["password"] 
        const element = inputMapping[inputType];
        const fields = [];
        if(field) {
          ancestors.forEach(ancestor => {
            const element = ancestor?.openingElement?.name?.name;
            const attributes = ancestor?.openingElement?.attributes;
            if(attributes?.length > 0 && element == "Repeat" || element == "Section") {
              const { prefix } = extractAttributes(attributes, ["prefix"]);
              if(prefix) fields.push(prefix)
            }
          })
        }
        fields.push(field)
        let comp = {
          type: "input",
          element,
          fields,
          flags,
          label
        }
        if(element == "Select") comp = {...comp, ...extractChoices(node, field)}
        if(element) {
          comps.push(comp)
        } else {
          comps.push({
            type: "unknown",
            value: src.substring(node.start, node.end).replace(/\s+/g, ' ')
          })
        }
      } 
    }
  })
}

const extractChoices = (selectNode, field) => {
  const choiceName = snakeToCamel(field) + "Choices";
  const children = selectNode.children;
  if(!children) return { choiceName, choices: {}}
  const choices = {};
  children.forEach(maybeOption => {
    if(maybeOption?.openingElement?.name?.name != "option") return;
    console.log('option')
    const attributes = maybeOption.openingElement?.attributes;
    if(!attributes) return;
    const { value: key } = extractAttributes(attributes, ["value"]) 
    const label = maybeOption?.children?.[0]?.value;
    if(key != null && label != null) choices[key] = label;
  })
  return {choiceName, choices}
} 

const extractAttributes = (attributes, toExtract) => {
  const extraction = {};
  toExtract.forEach(key => {
    extraction[key] = null;
  })
  attributes.forEach(attr => {
    toExtract.forEach(key => {
      const maybeValue = extractAttribute(attr, key);
      if(maybeValue) extraction[key] = maybeValue
    })
  });
  return extraction;
}

const extractAttribute = (attr, field) => {
  if(attr?.name?.name == field && attr?.value?.value) return attr.value.value
}

const snakeToCamel = str =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );