import { Fragment } from "react";

/**
 * Eenvoudige opmaak voor juridische teksten:
 * "## Titel", "### Subtitel", "- opsomming", **vet** en [link](https://...).
 * Lege regel = nieuwe alinea. Geen HTML, dus veilig.
 */
export function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{inline(para.join(" "))}</p>);
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push(<ul key={blocks.length}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
    list = [];
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flushPara(); flushList(); continue; }
    if (l.startsWith("### ")) { flushPara(); flushList(); blocks.push(<h3 key={blocks.length}>{inline(l.slice(4))}</h3>); continue; }
    if (l.startsWith("## ")) { flushPara(); flushList(); blocks.push(<h2 key={blocks.length}>{inline(l.slice(3))}</h2>); continue; }
    if (/^[-*] /.test(l)) { flushPara(); list.push(l.slice(2)); continue; }
    flushList();
    para.push(l);
  }
  flushPara();
  flushList();
  return <div className="richtext">{blocks}</div>;
}

function inline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((p, i) => {
    const b = p.match(/^\*\*([^*]+)\*\*$/);
    if (b) return <strong key={i}>{b[1]}</strong>;
    const a = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (a && /^(https?:|mailto:|tel:|\/)/.test(a[2])) return <a key={i} href={a[2]}>{a[1]}</a>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}
