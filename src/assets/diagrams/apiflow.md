---
config:
  layout: dagre
---
flowchart TD
    A["User UI (React + Carbon)"] --> B{"Transport layer"}
    B --> C1["Vite Proxy (local dev)"] & C2["Cloudflare Worker (production)"]

    C1 --> D["Cooper Hewitt GraphQL API"]
    C2 --> D

    D --> E1["PostgreSQL (metadata)"]
    D --> E2["Amazon S3 (media blobs)"]

    E1 --> D
    E2 --> A

    D --> F["JSON Response (ids, titles, refs)"]
    F --> A

    %% Carbon theme classes
    A:::carbonPink
    B:::carbonDefault
    C1:::carbonBlue
    C2:::carbonBlue
    D:::carbonGreen
    E1:::carbonYellow
    E2:::carbonYellow
    F:::carbonDefault

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616