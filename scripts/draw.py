#!/usr/bin/env python3
import argparse, re, sys, pathlib, yaml
from graphviz import Digraph

# =========================
#  Typography token presets
# =========================
TYPE_TOKENS = {
    "t-label-01":       {"fontsize": "12", "fontname": "IBM Plex Sans"},
    "t-helper-text-01": {"fontsize": "12", "fontname": "IBM Plex Sans"},
    "t-body-01":        {"fontsize": "14", "fontname": "IBM Plex Sans"},
    "t-body-02":        {"fontsize": "16", "fontname": "IBM Plex Sans"},
    "t-body-compact-01":{"fontsize": "13", "fontname": "IBM Plex Sans"},
    "t-body-compact-02":{"fontsize": "15", "fontname": "IBM Plex Sans"},
    "t-code-01":        {"fontsize": "12", "fontname": "IBM Plex Mono"},
    "t-code-02":        {"fontsize": "14", "fontname": "IBM Plex Mono"},
    "t-heading-01":     {"fontsize": "16", "fontname": "IBM Plex Sans SemiBold"},
    "t-heading-02":     {"fontsize": "20", "fontname": "IBM Plex Sans SemiBold"},
    "t-heading-03":     {"fontsize": "24", "fontname": "IBM Plex Sans SemiBold"},
    "t-heading-04":     {"fontsize": "28", "fontname": "IBM Plex Sans SemiBold"},
    "t-heading-05":     {"fontsize": "32", "fontname": "IBM Plex Sans SemiBold"},
}

# ---------- parsing helpers ----------
def unquote(s: str) -> str:
    if not s:
        return s
    if (s[0] == s[-1] == '"') or (s[0] == s[-1] == "'"):
        return s[1:-1]
    return s

def parse_markdown(md: str):
    cfg = {}
    m = re.match(r'^---\s*\n([\s\S]*?)\n---\s*\n?', md)
    if m:
        try:
            fm = yaml.safe_load(m.group(1)) or {}
            cfg = (fm.get('config') or {}) if isinstance(fm, dict) else {}
        except Exception:
            cfg = {}
        md = md[m.end():]

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

    nodes, edges, classes = {}, [], {}

    def ensure(nid):
        if nid not in nodes:
            nodes[nid] = {"label": nid, "shape": "rect", "classes": []}
        return nodes[nid]

    for line in (l.strip() for l in body.splitlines()):
        if not line or line.startswith('%') or re.match(r'^(flowchart|graph)\b', line, re.I):
            continue

        m = re.match(r'^classDef\s+([A-Za-z0-9_-]+)\s+(.+)$', line, flags=re.I)
        if m:
            name = m.group(1)
            parts = [p.strip() for p in m.group(2).split(',') if ':' in p]
            kv = {}
            for p in parts:
                k, v = p.split(':', 1)
                kv[k.strip()] = unquote(v.strip())
            classes[name] = {
                "fill":     kv.get("fill"),
                "stroke":   kv.get("stroke"),
                "color":    kv.get("color"),
                "fontname": kv.get("fontname"),
                "fontsize": kv.get("fontsize"),
            }
            continue

        m = re.match(r'^([A-Za-z0-9_-]+)\s*:::\s*([A-Za-z0-9_:.\-]+)$', line)
        if m:
            nid, rest = m.group(1), m.group(2)
            n = ensure(nid)
            toks = [t for t in rest.split(":::") if t]
            seen = set()
            n["classes"] = [t for t in (n["classes"] + toks) if (t not in seen and not seen.add(t))]
            continue

        m = re.match(r'^([A-Za-z0-9_-]+)\s*((\[[^\]]+\])|(\{[^}]+\}))$', line)
        if m:
            nid, part = m.group(1), m.group(2)
            n = ensure(nid)
            n["shape"] = "diamond" if part.startswith("{") else "rect"
            n["label"] = unquote(part[1:-1].strip())  # <-- keep explicit labels
            continue

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
                edges.append((src, dst))
            continue

    return {
        "direction": direction,
        "nodes": nodes,
        "edges": edges,
        "classes": classes,
        "config": cfg or {}
    }

# ---------- rendering ----------
CARBON = {
    "layer":  "#161616",
    "border": "#393939",
    "edge":   "#78a9ff"
}

def color_style(classes_list, classes_map):
    if classes_list:
        for c in classes_list:
            if c in classes_map:
                cc = classes_map[c]
                return {
                    "fillcolor": cc.get("fill")     or "#f4f4f4",
                    "color":     cc.get("stroke")   or CARBON["border"],
                    "fontcolor": cc.get("color")    or "#161616",
                    "fontname":  cc.get("fontname"),
                    "fontsize":  cc.get("fontsize"),
                }
    return {
        "fillcolor": "#f4f4f4",
        "color":     CARBON["border"],
        "fontcolor": "#161616",
        "fontname":  None,
        "fontsize":  None
    }

def type_style(classes_list):
    out = {}
    if not classes_list:
        return out
    for c in classes_list:
        if c in TYPE_TOKENS:
            out.update(TYPE_TOKENS[c])
    return out

def build_graph(model):
    rankdir = "LR" if model["direction"] == "LR" else "TB"
    bg = model["config"].get("background", "#FFFFFF")

    g = Digraph("G", format="svg")
    g.attr(rankdir=rankdir, nodesep="0.4", ranksep="0.8", bgcolor=bg)

    g.attr(
        "node",
        shape="box",
        style="rounded,filled",
        width="2.6",
        height="0.9",
        color=CARBON["border"],
        fillcolor="#f4f4f4",
        fontcolor="#161616",
        penwidth="1",
        fontname="IBM Plex Sans",
        fontsize="14"
    )
    g.attr("edge", color=CARBON["edge"], penwidth="2", arrowsize="0.7")

    for nid, nd in model["nodes"].items():
        classes_list = nd.get("classes", [])
        csty = color_style(classes_list, model["classes"])
        tsty = type_style(classes_list)

        attrs = {
            "label": nd.get("label") if nd.get("label") else nid,
            "color": csty["color"],
            "fillcolor": csty["fillcolor"],
            "fontcolor": csty["fontcolor"],
        }

        if csty.get("fontname"):
            attrs["fontname"] = csty["fontname"]
        if csty.get("fontsize"):
            attrs["fontsize"] = str(csty["fontsize"])
        if tsty.get("fontname"):
            attrs["fontname"] = tsty["fontname"]
        if tsty.get("fontsize"):
            attrs["fontsize"] = tsty["fontsize"]

        if nd.get("shape") == "diamond":
            attrs["shape"] = "diamond"
            attrs["style"] = "filled"
            attrs["height"] = "1.1"
            attrs["width"] = "2.2"

        g.node(nid, **attrs)

    for (s, t) in model["edges"]:
        tgt_classes = model["nodes"].get(t, {}).get("classes", [])
        stroke = color_style(tgt_classes, model["classes"])["color"]
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
    ap = argparse.ArgumentParser(description="Draw Mermaid-like flowchart to SVG (Carbon-styled, IBM Plex typography)")
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