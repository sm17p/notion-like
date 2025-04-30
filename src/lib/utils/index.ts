export function findNearestEditableNode(node: Node | null): HTMLElement | null {
  if (node?.nodeType === 1 && node instanceof HTMLElement) {
    if (node.dataset.text) {
      return node;
    } else if (node.classList.contains('editor')) {
      let newNode = node.children[2] as HTMLElement;
      let textNode = newNode.querySelectorAll('[data-text]');
      return textNode.length === 0 ? newNode : textNode[textNode.length-1] as HTMLElement
    } else {
      let textNode = node.querySelectorAll('[data-text]');
      return textNode.length === 0 ? node : textNode[textNode.length-1] as HTMLElement;
    }
  } else if (node?.nodeType === Node.TEXT_NODE) {
    return node.parentElement;
  } 
  console.log("🚀 ~ findNearestEditableNode ~ node?.nodeType:", node, node?.nodeType);

  return node ? node.parentElement : null;
}