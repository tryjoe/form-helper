<script>
  import Editor from "$lib/Editor.svelte";
  import { renderSvelte } from "$lib/renderSvelte.js";
  import CodeView from "$lib/CodeView.svelte";
  import { createAst } from "./createAst.js";
  import { extractFields } from "$lib/extractForm.js";
  import { astToShorthand } from "$lib/astToShorthand.js";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { Copy } from "@steeze-ui/iconic-free";

  const comment = `/**

Paste entire .jsx file with NewForm fields here!

You'll still need to include ifs / loops / non-form html
etc., but it should be a good starting point 

Also, it's not actually running the code, so any
variables etc. used in the form jsx will be missing.

You can also directly edit the shorthand form code
to the right to generate the svelte code (if you're
not starting with NewForm code)

It has the structure:

Component
  field ...subfields
  label
  choicesVariableName (for Select)
    key1 label1
    key2 label2

components it understands are:

Checkbox
DateInput
DateTimeInput
MultiCheckbox
NumberInput
Select
Textarea
TextInput
YesNo
Prompt
Note

**/`;

  let source = "blah";
  let outputEditor;
  let jsxSource;
  let jsxOutput = null;
  let shorthandEditor;
  let includeReadout = true;

  const copy = () => {
    console.log("copy");
  };

  const updateShorthandWithExtraction = () => {
    const newSrc = astToShorthand(extractFields(jsxSource));
    if (shorthandEditor) shorthandEditor.setValue(newSrc);
  };
</script>

<div class="panes">
  <div class="pane jsx">
    <div class="jsx-header">
      <button type="button" on:click={updateShorthandWithExtraction}>
        Extract NewForm →
      </button>
    </div>
    <div class="jsx-editor">
      <Editor language="jsx" bind:value={jsxSource} initialValue={comment} />
    </div>
  </div>
  <div class="pane shorthand">
    <Editor
      language={null}
      bind:value={source}
      bind:this={shorthandEditor}
      initialValue={"TextInput\n  first_name\n  First name\n\nPrompt\n  What are you favorite things?\n\nSelect\n  favorites color\n  Color?\n  colorChoices\n    blue Blue\n    red Red\n    green Green"}
    />
  </div>
  <div class="pane render">
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="copy-icon" on:click={copy}>
      <Icon src={Copy} theme="solid" class="color-white" />
    </div>
    <div>
      <span class="readout-label">Include readout</span>
      <input bind:checked={includeReadout} type="checkbox" />
    </div>
    <CodeView
      language="svelte"
      src={renderSvelte(createAst(source), includeReadout)}
    />
  </div>
</div>

<style>
  .panes {
    width: calc(100%-2px);
    height: 100%;
    display: flex;
    align-items: stretch;
    gap: 1px;
    background: rgb(8, 11, 18);
    font-family: "Source Sans 3";
    color: white;
  }
  .jsx-header {
    display: flex;
    position: fixed;
    justify-content: center;
    align-items: flex-end;
    width: calc(35vw - 18px);
    height: 38px;
    flex-direction: column;
    z-index: 100;
    background: rgb(35, 38, 45);
  }
  .jsx-header button {
    width: 160px;
    margin-right: 3px;
    height: 26px;
    outline: 0;
    border: 0;
    background: white;
    border-radius: 5px;
    font-family: "Source Sans 3";
    font-weight: 500;
    font-size: 15px;
  }
  .jsx-editor {
    width: 35vw;
    min-height: calc(100vh - 38px);
    position: absolute;
    top: 38px;
    left: 0;
  }
  .pane {
    height: 100%;
    overflow-y: auto;
    background: rgb(40, 44, 52);
    position: relative;
    scrollbar-color: rgb(31, 34, 40) rgb(35, 38, 45);
  }
  .pane :global(.editor) {
    height: 100vh;
  }
  .jsx :global(.editor) {
    height: calc(100vh - 38px);
  }

  .copy-icon {
    color: white;
    width: 24px;
    height: 24px;
    position: fixed;
    top: 6px;
    right: 24px;
    z-index: 100;
    cursor: pointer;
  }
  .jsx {
    position: relative;
    height: 100%;
    width: 35vw;
  }
  .shorthand {
    width: calc(30vw - 2px);
  }
  .render {
    width: 35vw;
  }
  .readout-label {
    font-size: 14px;
    margin: 6px 6px 0 6px;
  }
  .panes input {
    margin-top: 6px;
  }
</style>
