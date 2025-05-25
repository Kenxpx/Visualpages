// content.ts

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (searchText: string): HTMLElement | null => {
  if (!searchText) return null; // Return null if searchText is empty

  const escapedSearchText = escapeRegExp(searchText);
  const regex = new RegExp(`(${escapedSearchText})`, 'gi');

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
  );

  const span = document.createElement('span');
  span.className = 'docagram-highlight';

  let node: Node | null;
  const nodes: Node[] = [];

  // First, collect all text nodes
  while ((node = walker.nextNode())) {
    nodes.push(node);
  }

  let firstHighlight: HTMLElement | null = null;

  // Then process them (to avoid tree walker issues)
  nodes.forEach((textNode) => {
    const content = textNode.textContent || '';
    if (regex.test(content)) {
      const parts = content.split(regex);
      const fragment = document.createDocumentFragment();

      parts.forEach((part) => {
        if (part.toLowerCase() === searchText.toLowerCase()) {
          const highlight = span.cloneNode() as HTMLElement;
          highlight.textContent = part;

          // Save the first highlighted element
          if (!firstHighlight) {
            firstHighlight = highlight;
          }

          fragment.appendChild(highlight);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    }
  });

  return firstHighlight;
};

// Remove existing highlights
const removeHighlights = (): void => {
  document.querySelectorAll('.docagram-highlight').forEach((el) => {
    const text = el.textContent || '';
    if (el.parentNode) {
      el.parentNode.replaceChild(document.createTextNode(text), el);
    }
  });
};

// Listen for messages from the popup or side panel
chrome.runtime.onMessage.addListener((
  request: { action: string; entity: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (request.action === 'highlight') {
    console.log('Highlighting', request.entity);
    removeHighlights();

    const firstHighlight = highlightText(request.entity);

    // Scroll to the first highlight if it exists
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    sendResponse({ success: true });
  }
  return true; // Required for async response
});

// Insert styles
const style = document.createElement('style');
style.textContent = `
  .docagram-highlight {
    background-color: #fef08a;
    border-radius: 2px;
    transition: background-color 0.2s;
  }
  .docagram-highlight:hover {
    background-color: #fde047;
  }
`;
document.head.appendChild(style);