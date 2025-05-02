<script>
  import { basicSetup } from "codemirror";
  import { EditorView, keymap } from "@codemirror/view";
  import { EditorState } from "@codemirror/state";
  import { javascript } from "@codemirror/lang-javascript";
  import { svelte } from "@replit/codemirror-lang-svelte";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { indentWithTab } from "@codemirror/commands";
  import { CompletionContext } from "@codemirror/autocomplete";
  import { onMount } from "svelte";
  import { inlineSuggestion } from "codemirror-extension-inline-suggestion";

  export let language = "javascript";

  export let initialValue = null;
  export let value = "hello";

  export const setValue = (val) => {
    if (!editor) return;
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: val },
    });
  };

  const withLanguage = (extensions) => {
    console.log(language);
    if (language == "javascript") extensions.splice(1, 0, javascript());
    if (language == "jsx") extensions.splice(1, 0, javascript({ jsx: true }));
    return extensions;
  };

  const completion = (context) => {
    console.log(context);
    return null;
  };

  let editor;
  onMount(() => {
    editor = new EditorView({
      doc: "console.log('hello')\n",
      extensions: withLanguage([
        basicSetup,
        keymap.of(indentWithTab),
        oneDark,
        EditorView.updateListener.of(({ state, docChanged }) => {
          if (!docChanged) return;
          value = state.doc.toString();
        }),
      ]),
      parent: editorDiv,
    });
    if (initialValue) setValue(initialValue);
  });
  let editorDiv;
</script>

<div class="editor" bind:this={editorDiv}></div>

<style>
  .editor :global(.cm-editor) {
    height: 100%;
    width: 100%;
    padding: 8px 0 0 4px;
    box-sizing: border-box;
  }
</style>
