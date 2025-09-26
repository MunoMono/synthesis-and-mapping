---
config:
  layout: dagre
---
flowchart TD
    A["Administrator"] --> B["RCA DDR Archive Platform"]
    C["Researcher"] --> B
    B --> D["Auth0 (Identity Provider)"]
    B --> E["Cooper Hewitt API (External Data)"]
    B --> F["DigitalOcean (Hosting, DB, Storage)"]

    %% Carbon theme classes
    A:::carbonPink
    C:::carbonPink
    B:::carbonGreen
    D:::carbonBlue
    E:::carbonBlue
    F:::carbonYellow

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616