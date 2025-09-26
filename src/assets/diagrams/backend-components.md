---
config:
  layout: dagre
---
flowchart TD
    %% Main service
    BACKEND_SERVICE["Backend Service (API for communication between interface and database)"]

    %% Top: security + logic
    AUTHENTICATION_MODULE["Authentication Module (validates logins and roles)"]
    REQUEST_HANDLER["Request Handler (processes queries and updates)"]
    INGESTION_SERVICE["Ingestion Service (handles metadata and file uploads)"]
    TAXONOMY_SERVICE["Taxonomy Service (manages terms, tags, and agents)"]

    %% Bottom: persistence + audit
    AUDIT_LOGGING["Audit Logging (records changes and provenance)"]
    STORAGE_CONNECTOR["Storage Connector (secure upload/download links to Spaces)"]
    DATABASE_SERVICE["Database Service (stores metadata and embeddings in PostgreSQL)"]

    %% Connect top modules to backend
    AUTHENTICATION_MODULE --> BACKEND_SERVICE
    REQUEST_HANDLER --> BACKEND_SERVICE
    INGESTION_SERVICE --> BACKEND_SERVICE
    TAXONOMY_SERVICE --> BACKEND_SERVICE

    %% Connect backend to bottom modules
    BACKEND_SERVICE --> AUDIT_LOGGING
    BACKEND_SERVICE --> STORAGE_CONNECTOR
    BACKEND_SERVICE --> DATABASE_SERVICE

    %% Rank constraints
    {rank=above; AUTHENTICATION_MODULE REQUEST_HANDLER INGESTION_SERVICE TAXONOMY_SERVICE}
    {rank=below; AUDIT_LOGGING STORAGE_CONNECTOR DATABASE_SERVICE}

    %% Apply Carbon colours *after edges*
    BACKEND_SERVICE:::carbonGreen
    AUTHENTICATION_MODULE:::carbonBlue
    REQUEST_HANDLER:::carbonGreen
    INGESTION_SERVICE:::carbonGreen
    TAXONOMY_SERVICE:::carbonGreen
    AUDIT_LOGGING:::carbonYellow
    STORAGE_CONNECTOR:::carbonYellow
    DATABASE_SERVICE:::carbonYellow

    %% Carbon theme classes
    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616