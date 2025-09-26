---
config:
  layout: dagre
---
flowchart TD
    A["Administrator"] --> FE["Frontend (React + Carbon)"]
    B["Researcher"] --> FE
    FE --> BE["Backend API (FastAPI + GraphQL)"]
    BE --> DB["PostgreSQL (Metadata + pgvector)"]
    BE --> OS["DigitalOcean Spaces (Media Store)"]
    BE --> AUTH["Auth0 (JWT validation)"]
    BE --> CH["Cooper Hewitt API (Ingestion Source)"]

    %% Carbon theme classes
    A:::carbonPink
    B:::carbonPink
    FE:::carbonGreen
    BE:::carbonGreen
    DB:::carbonYellow
    OS:::carbonYellow
    AUTH:::carbonBlue
    CH:::carbonBlue

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616