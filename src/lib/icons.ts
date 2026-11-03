/**
 * One icon system: Lucide (ISC) outline icons, plus the GitHub mark from Simple Icons (CC0).
 * SVG sources are inlined at build time; size and stroke are normalised here.
 */
import search from 'lucide-static/icons/search.svg?raw';
import sun from 'lucide-static/icons/sun.svg?raw';
import moon from 'lucide-static/icons/moon.svg?raw';
import menu from 'lucide-static/icons/menu.svg?raw';
import close from 'lucide-static/icons/x.svg?raw';
import copy from 'lucide-static/icons/copy.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import arrowRight from 'lucide-static/icons/arrow-right.svg?raw';
import arrowLeft from 'lucide-static/icons/arrow-left.svg?raw';
import external from 'lucide-static/icons/arrow-up-right.svg?raw';
import languages from 'lucide-static/icons/languages.svg?raw';
import rss from 'lucide-static/icons/rss.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import list from 'lucide-static/icons/list-tree.svg?raw';
import enter from 'lucide-static/icons/corner-down-left.svg?raw';
import github from 'simple-icons/icons/github.svg?raw';

const OUTLINE = { search, sun, moon, menu, close, copy, check, arrowRight, arrowLeft, external, languages, rss, mail, list, enter } as const;
const FILLED = { github } as const;

export type IconName = keyof typeof OUTLINE | keyof typeof FILLED;

// Strip size and class from the root <svg> only; inner shapes (e.g. <rect width>) must keep theirs.
const clean = (svg: string) =>
  svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height|class)="[^"]*"/g, ''))
    .replace(/<title>[\s\S]*?<\/title>/g, '');

export function iconSvg(name: IconName, size = 18): string {
  const attrs = `width="${size}" height="${size}" class="icon icon-${name}" aria-hidden="true" focusable="false"`;
  if (name in FILLED) {
    return clean(FILLED[name as keyof typeof FILLED]).replace('<svg', `<svg ${attrs} fill="currentColor"`);
  }
  return clean(OUTLINE[name as keyof typeof OUTLINE])
    .replace(/stroke-width="[^"]*"/, 'stroke-width="1.75"')
    .replace('<svg', `<svg ${attrs}`);
}
