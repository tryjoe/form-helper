<script>
  import { codeToHtml } from "shiki";
  export let src = "";
  export let language = "svelte";

  let html = "";
  const highlightSource = async (source) => {
    html = await codeToHtml(source, {
      lang: language,
      theme: "one-dark-pro",
    });
  };
  $: highlightSource(src);
</script>

<div class="code-view">
  {@html html}
</div>

<style>
  .code-view {
    position: relative;
    height: 100%;
    overflow: auto;
  }
  .code-view :global(pre) {
    padding: 16px;
    margin: 0;
    font-size: 13px;
    border-radius: 5px;
    font-family: "Fira Code";
    line-height: 1.4;
    height: 100%;
    box-sizing: border-box;
  }
</style>
