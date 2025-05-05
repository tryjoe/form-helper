import { parseIndentedText } from "./parseTree.js";

const inputs = [
  'Checkbox',
  'DateInput',
  'DateTimeInput',
  'MultiCheckbox',
  'NumberInput',
  'Select',
  'Textarea',
  'TextInput',
  'YesNo',
]
const nonInputs = [
  'Prompt',
  'Note',
  'Header'
]
const choiceInputs = [
  'Select',
  'MultiCheckbox'
]

export const createAst = (src) => {
  const tree = parseIndentedText(src);
  if(!tree) return [];
  return tree.map(child => {
    if(inputs.includes(child.content)){
      let comp = {
        type: "input",
        element: child.content,
        ...extractFieldAndLabel(child)
      }
      if(choiceInputs.includes(child.content) && child?.children?.[2]) {
        comp = {...comp, ...extractChoices(child.children[2])}
      }
      return comp
    } else if(nonInputs.includes(child.content)) {
      return {
        type: "non-input",
        element: child.content,
        content: child.children?.[0]?.content
      }
    } else {
      return {
        type: "unknown",
        value: child.content
      }
    }
  })
}

const extractFieldAndLabel = (node) => {
  const fieldAndLabel = {}
  if(node.children?.[0]) {
    if(node.children[0] == '.') fieldAndLabel.fields = null;
    else fieldAndLabel.fields = node.children[0].content.split(/[\s,]+/).filter(Boolean);
  }
  if(node.children?.[1]) {
    if(node.children[1] == '.') fieldAndLabel.label = null;
    else fieldAndLabel.label = node.children[1].content
  }
  return fieldAndLabel;
}

const extractChoices = (node) => {
  const choiceName = node.content
  const choices = {}
  if(node.children) node.children.forEach(child => {
    const parts = child.content.split(/[\s,]+/).filter(Boolean)
    let key = parts[0];
    let label = key;
    if(parts?.[1]) label = parts[1];
    choices[key] = label;
  })
  return {choiceName, choices}
}
