# Form Helper

Write svelte form code with shorthand or paste NewForm code and extract basic 

You'll still need to include ifs / loops / non-form html etc., but it should be a good starting point 

Also, it's not actually running the code, so any variables etc. used in the form jsx will be missing.

You can also directly edit the shorthand form code to generate the svelte code (if you're not starting with NewForm code)

Shorthand structure:

```
Component
  field
  label
  choicesVariableName (for Select)
    key1 label1
    key2 label2
```

components it understands are:

- Checkbox
- DateInput
- DateTimeInput
- MultiCheckbox
- NumberInput
- Select
- Textarea
- TextInput
- YesNo
- Prompt
- Note