---
config:
  layout: dagre
---
flowchart TD
    RESEARCHER_NODE["Researcher enters a search query"] -->|Submits query| FRONTEND_APPLICATION["Frontend Search Interface (built with the React framework and styled using the IBM Carbon Design System)"]

    FRONTEND_APPLICATION -->|Sends query to backend| BACKEND_APPLICATION["Backend Service (implemented with the FastAPI framework and exposing a GraphQL semantic search endpoint)"]

    BACKEND_APPLICATION -->|Requests embeddings and metadata| DATABASE_SERVICE["PostgreSQL Database with pgvector extension (stores structured metadata together with semantic embeddings for similarity search)"]

    DATABASE_SERVICE -->|Returns ranked list of semantically similar artefacts| BACKEND_APPLICATION

    BACKEND_APPLICATION -->|Returns results| FRONTEND_APPLICATION

    FRONTEND_APPLICATION -->|Displays results and related artefacts| RESEARCHER_NODE

    %% Apply Carbon colours
    RESEARCHER_NODE:::carbonPink
    FRONTEND_APPLICATION:::carbonGreen
    BACKEND_APPLICATION:::carbonGreen
    DATABASE_SERVICE:::carbonYellow

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616