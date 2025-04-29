export function findNextNonCommentSibling(node: Node | null): Element | Text | null {
    let sibling: Node | null = node ? node.nextSibling : null;

    while (sibling && sibling.nodeType === Node.COMMENT_NODE) {
      sibling = sibling.nextSibling;
    }

    if (sibling && (sibling.nodeType === Node.ELEMENT_NODE || sibling.nodeType === Node.TEXT_NODE)) {
      return sibling as Element | Text;
    }

    return null;
  }