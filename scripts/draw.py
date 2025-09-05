#!/usr/bin/env python3
import argparse, re, sys, pathlib, yaml
from graphviz import Digraph

# ---------- parsing helpers ----------
def unquote(s: str) -> str:
    if not s:
        return s
    if (s[0] == s[-1] == '"') or (s[0] == s[-1] == "'"):
        return s[1:-1]
    return s

def parse_markdown(md: str):
    # front-matter
    cfg = {}
    m = re.match(r'^---\s*\n([\s\S]*?)\n---\s*\n?', md)
    if m:
        try:
            fm = yaml.safe_load(m.group(1)) or {}
            cfg = (fm.get('config') or {}) if isinstance(fm, dict) else {}
        except Exception:
            cfg = {}
        md = md[m.end():]

    # flowchart body (fenced or unfenced)
    fenced = re.search(r'```(?:flowchart|mermaid)\s+([\s\S]*?)```', md, flags=re.M)
    if fenced:
        body = fenced.group(1)
        head = re.search(r'^(?:flowchart|graph)\s+(TD|LR)\b', body, flags=re.I|re.M)
    else:
        m2 = re.search(r'^(?:flowchart|graph)\s+(TD|LR)\b[\s\S]*', md, flags=re.I|re.M)
        if not m2:
            sys.exit("No 'flowchart TD|LR' block found.")
        body = m2.group(0)
        head = re.search(r'^(?:flowchart|graph)\s+(TD|LR)\b', body, flags=re.I|re.M)

    direction = (head.group(1).upper() if head else 'TD')

    nodes = {}   # id -> {label, shape, cls}
    edges = []   # (src, dst, cls)
    classes = {} # name -> {fill, stroke, color}

    def ensure(nid):
        if nid not in nodes:
            nodes[nid] = {"label": nid, "shape": "rect", "cls": None}
        return nodes[nid]

    for line in (l.strip() for l in body.splitlines()):
        if not line or line.startswith('%') or re.match(r'^(flowchart|graph)\b', line, re.I):
            continue

        # classDef NAME fill:#..,stroke:#..,color:#..
        m = re.match(r'^classDef\s+([A-Za-z0-9_-]+)\s+(.+)$', line, flags=re.I)
        if m:
            name = m.group(1)
            kv = dict(
                (k.strip(), v.strip())
                for k, v in (p.split(':', 1) for p in m.group(2).split(',') if ':' in p)
            )
            classes[name] = {
                "fill":   kv.get("fill"),
                "stroke": kv.get("stroke"),
                "color":  kv.get("color"),
            }
            continue

        # class attach: A:::cls
        m = re.match(r'^([A-Za-z0-9_-]+)\s*:::\s*([A-Za-z0-9_-]+)$', line)
        if m:
            ensure(m.group(1))["cls"] = m.group(2)
            continue

        # node declaration: A["Label"] | B{ "Decision" }
        m = re.match(r'^([A-Za-z0-9_-]+)\s*((\[[^\]]+\])|(\{[^}]+\}))$', line)
        if m:
            nid, part = m.group(1), m.group(2)
            n = ensure(nid)
            n["shape"] = "diamond" if part.startswith("{") else "rect"
            n["label"] = unquote(part[1:-1].strip())
            continue

        # edges (allow grouped RHS via "&"): A --> B & C & D
        m = re.match(r'^(.+?)\s*-->\s*(.+)$', line)
        if m:
            lhs, rhs = m.group(1).strip(), m.group(2).strip()
            mL = re.match(r'^([A-Za-z0-9_-]+)\s*((\[[^\]]+\])|(\{[^}]+\}))?$', lhs)
            if not mL:
                continue
            src = mL.group(1)
            ensure(src)
            if mL.group(2):
                part = mL.group(2)
                nodes[src]["shape"] = "diamond" if part.startswith("{") else "rect"
                nodes[src]["label"] = unquote(part[1:-1].strip())

            for t in [t.strip() for t in rhs.split('&') if t.strip()]:
                mR = re.match(r'^([A-Za-z0-9_-]+)\s*((\[[^\]]+\])|(\{[^}]+\}))?$', t)
                if not mR:
                    continue
                dst = mR.group(1)
                ensure(dst)
                if mR.group(2):
                    part = mR.group(2)
                    nodes[dst]["shape"] = "diamond" if part.startswith("{") else "rect"
                    nodes[dst]["label"] = unquote(part[1:-1].strip())
                edges.append((src, dst, None))
            continue

    return {
        "direction": direction,
        "nodes": nodes,
        "edges": edges,
        "classes": classes,
        "config": cfg or {}
    }

# ---------- rendering (Graphviz) ----------
CARBON = {
    "layer":  "#161616",
    "border": "#393939",
    "text":   "#f4f4f4",
    "edge":   "#78a9ff"
}

def class_style(cls, classes):
    if not cls or cls not in classes:
        return {"fillcolor": CARBON["layer"], "color": CARBON["edge"], "fontcolor": CARBON["text"]}
    c = classes[cls]
    return {
        "fillcolor": c.get("fill")   or CARBON["layer"],
        "color":     c.get("stroke") or CARBON["edge"],
        "fontcolor": c.get("color")  or CARBON["text"],
    }

def build_graph(model):
    rankdir = "LR" if model["direction"] == "LR" else "TB"
    g = Digraph("G", format="svg")
    g.attr(rankdir=rankdir, nodesep="0.4", ranksep="0.8", bgcolor="#F4F4F4")
    g.attr("node",
           shape="box", style="rounded,filled",
           width="2.6", height="0.9",
           color=CARBON["border"], fillcolor=CARBON["layer"], fontcolor=CARBON["text"],
           penwidth="1", fontname="IBM Plex Sans")
    g.attr("edge", color=CARBON["edge"], penwidth="2", arrowsize="0.7")

    for nid, nd in model["nodes"].items():
        sty = class_style(nd.get("cls"), model["classes"])
        attrs = {
            "label": nd.get("label", nid),
            "color": sty["color"],
            "fillcolor": sty["fillcolor"],
            "fontcolor": sty["fontcolor"],
        }
        if nd.get("shape") == "diamond":
            attrs["shape"] = "diamond"
            attrs["style"] = "filled"
            attrs["height"] = "1.1"
            attrs["width"] = "2.2"
        g.node(nid, **attrs)

    for (s, t, _cls) in model["edges"]:
        tgt_cls = model["nodes"].get(t, {}).get("cls")
        stroke = class_style(tgt_cls, model["classes"])["color"]
        g.edge(s, t, color=stroke)

    return g

def render_file(in_path: pathlib.Path, out_path: pathlib.Path):
    md = in_path.read_text(encoding="utf-8")
    model = parse_markdown(md)
    g = build_graph(model)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    svg_bytes = g.pipe(format="svg")
    out_path.write_bytes(svg_bytes)
    print(f"Wrote {out_path}")

def main():
    ap = argparse.ArgumentParser(description="Draw Mermaid-like flowchart to SVG (Carbon-styled)")
    ap.add_argument("-i", "--in", dest="inpath", required=True, help="Input .md file OR a directory to render all .md")
    ap.add_argument("-o", "--out", dest="outpath", help="Output .svg (file mode only)")
    ap.add_argument("--outdir", default="src/assets", help="Output directory (directory mode)")
    args = ap.parse_args()

    inpath = pathlib.Path(args.inpath)
    if inpath.is_dir():
        outdir = pathlib.Path(args.outdir)
        for md in sorted(inpath.glob("*.md")):
            out = outdir / (md.stem + ".svg")
            render_file(md, out)
    else:
        if not args.outpath:
            sys.exit("When -i is a file, you must provide -o OUTPUT.svg")
        render_file(inpath, pathlib.Path(args.outpath))

if __name__ == "__main__":
    main()