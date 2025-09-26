---
config:
  layout: dagre
---
flowchart TD
    ITEM["Item"]:::carbonGreen
    MEDIA["MediaAsset"]:::carbonYellow
    AGENT["Agent"]:::carbonBlue
    TERM["Term"]:::carbonBlue
    TAG["Tag"]:::carbonBlue
    AUDIT["AuditLog"]:::carbonYellow

    ITEM --> MEDIA
    ITEM --> AGENT
    ITEM --> TERM
    ITEM --> TAG
    ITEM --> AUDIT

    %% Carbon theme classes
    ITEM:::carbonGreen
    MEDIA:::carbonYellow
    AGENT:::carbonBlue
    TERM:::carbonBlue
    TAG:::carbonBlue
    AUDIT:::carbonYellow

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616