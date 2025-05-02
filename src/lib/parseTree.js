export function parseIndentedText(text) {
  const lines = text.split('\n');
  const root = { content: 'root', children: [] };
  const stack = [root];

  for (const line of lines) {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[0].length : 0;
    const content = line.trim();

    if (content) {
      const node = { content, children: [] };

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1];
      parent.children.push(node);
      node.indent = indent
      stack.push(node);
    }
  }
  return root.children;
}
