---
config:
  layout: dagre
---
flowchart TD
    A["Administrator (logged in via external identity provider)"] --> B["Administrator Dashboard"]
    B --> C1["Ingest Metadata (forms and validation)"]
    C1 --> C2["Upload Media (via secure presigned link)"]
    C2 --> C3["Edit or Correct Items"]
    B --> D1["Manage Controlled Terms and Linked Agents"]
    B --> D2["Review Audit Logs (provenance and history)"]

    %% Class styling applied after edges (like exemplar)
    A:::carbonPink
    B:::carbonGreen
    C1:::carbonGreen
    C2:::carbonGreen
    C3:::carbonGreen
    D1:::carbonGreen
    D2:::carbonYellow

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616