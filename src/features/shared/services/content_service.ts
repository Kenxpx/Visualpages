import { DEFAULT_OPTIONS } from "@/features/options/Options";

export class ContentService {
  static async getPageContent(): Promise<string> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (): string => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function (node: Text): number {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;

              if (parent.offsetHeight === 0) return NodeFilter.FILTER_REJECT;

              const tag = parent.tagName.toLowerCase();
              if (tag === "script" || tag === "style")
                return NodeFilter.FILTER_REJECT;

              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        let text = "";
        let node: Text | null;
        while ((node = walker.nextNode() as Text | null)) {
          text += node.textContent + " ";
        }

        return text.replace(/\s+/g, " ").trim();
      },
    });

    return result as string;
  }

  static async splitIntoChunks(content: string): Promise<string[]> {

    const result = await chrome.storage.sync.get('docagramOptions');
    const options = result.docagramOptions || DEFAULT_OPTIONS;
    const chunkSize = options.chunkSize;
    
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
