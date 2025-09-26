---
config:
  layout: dagre
---
flowchart TD
    ADMINISTRATOR_NODE["Administrator uploads metadata and media"] --> FRONTEND_APPLICATION["Frontend App (React + Carbon)"]

    FRONTEND_APPLICATION --> BACKEND_SERVICE["Backend Service (FastAPI + GraphQL)"]

    BACKEND_SERVICE --> OBJECT_STORAGE["Object Storage (DigitalOcean Spaces)"]
    BACKEND_SERVICE --> RELATIONAL_DATABASE["Database (PostgreSQL)"]
    BACKEND_SERVICE --> AUDIT_LOGGING["Audit Logs (provenance + history)"]

    OBJECT_STORAGE --> BACKEND_SERVICE
    BACKEND_SERVICE --> FRONTEND_APPLICATION
    FRONTEND_APPLICATION --> OBJECT_STORAGE

    %% Apply Carbon colours *after* the edges
    ADMINISTRATOR_NODE:::carbonPink
    FRONTEND_APPLICATION:::carbonGreen
    BACKEND_SERVICE:::carbonGreen
    OBJECT_STORAGE:::carbonYellow
    RELATIONAL_DATABASE:::carbonYellow
    AUDIT_LOGGING:::carbonYellow

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616