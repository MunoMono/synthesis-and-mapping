---
config:
  layout: dagre
---
flowchart TD
    A["Context engineering strategy"] --> B{"Context components"}
    B --> C1["cinstr"] & C2["cknow"] & C3["ctools"] & C4["cmem"] & C5["cstate"] & C6["cquery"]
    C1 --> D["Assembly and optimisation"]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D
    D --> E{"RAG query analyzer"}
    E --> F1["Vector RAG"] & F2["Graph RAG"] & F3["other modalities"]
    F1 --> G["Fusion layer"]
    F2 --> G
    F3 --> G
    G --> H["LLM generator"]
    H --> I["Final answer"]
     A:::carbonPink
     B:::carbonDefault
     C1:::carbonBlue
     C2:::carbonBlue
     C3:::carbonBlue
     C4:::carbonBlue
     C5:::carbonBlue
     C6:::carbonBlue
     D:::carbonGreen
     E:::carbonDefault
     F1:::carbonBlue
     F2:::carbonPink
     F3:::carbonYellow
     G:::carbonGreen
     H:::carbonDefault
     I:::carbonDefault
    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616