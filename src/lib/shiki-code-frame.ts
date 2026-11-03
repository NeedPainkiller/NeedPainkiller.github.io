import type { ShikiTransformer } from 'shiki';

/**
 * Wraps every highlighted block in <figure class="code-frame"> with a caption that carries
 * the optional file name (```ts title="app.ts") and the language label.
 * `nolines` in the meta, or plain-text languages, turn line numbers off.
 */
const PLAIN = new Set(['text', 'plaintext', 'txt', 'plain', 'ansi']);

export function codeFrame(): ShikiTransformer {
  return {
    name: 'my-blog:code-frame',
    pre(node) {
      // Astro already sets data-language on <pre>; only add what it does not.
      const raw = String((this.options.meta as { __raw?: string } | undefined)?.__raw ?? '');
      const lang = String(this.options.lang ?? 'text');
      if (/\bnolines\b/.test(raw) || PLAIN.has(lang)) node.properties['data-nolines'] = '';
      node.properties.tabindex = '0';
    },
    root(root) {
      const pre = root.children.find((c) => c.type === 'element' && c.tagName === 'pre');
      if (!pre || pre.type !== 'element') return;
      const raw = String((this.options.meta as { __raw?: string } | undefined)?.__raw ?? '');
      const m = /title=(?:"([^"]+)"|'([^']+)'|(\S+))/.exec(raw);
      const title = m ? (m[1] ?? m[2] ?? m[3]) : '';
      const lang = String(this.options.lang ?? 'text');
      const caption = {
        type: 'element' as const,
        tagName: 'figcaption',
        properties: { className: ['code-frame__caption'] },
        children: [
          {
            type: 'element' as const,
            tagName: 'span',
            properties: { className: ['code-frame__title'] },
            children: [{ type: 'text' as const, value: title }],
          },
          {
            type: 'element' as const,
            tagName: 'span',
            properties: { className: ['code-frame__lang'] },
            children: [{ type: 'text' as const, value: PLAIN.has(lang) ? '' : lang }],
          },
        ],
      };
      root.children = [
        {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['code-frame'], 'data-has-title': title ? 'true' : 'false' },
          children: [caption, pre],
        },
      ];
    },
  };
}
