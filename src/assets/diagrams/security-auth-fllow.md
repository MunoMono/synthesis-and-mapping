---
config:
  layout: dagre
---
flowchart TD
    ADMINISTRATOR["Administrator logs in to the system"] --> FRONTEND_APPLICATION["Frontend Application (built with the React framework and styled using the IBM Carbon Design System)"]

    FRONTEND_APPLICATION -->|Send login details| EXTERNAL_IDENTITY_PROVIDER["External Identity Provider Service (verifies login details and issues secure tokens)"]
    EXTERNAL_IDENTITY_PROVIDER -->|Return secure token| FRONTEND_APPLICATION

    FRONTEND_APPLICATION -->|Send request with token| BACKEND_SERVICE["Backend Service (provides application programming interface built with the FastAPI framework and the GraphQL query language)"]

    BACKEND_SERVICE -->|Verify token| EXTERNAL_IDENTITY_PROVIDER
    BACKEND_SERVICE -->|Return requested data| FRONTEND_APPLICATION

    %% Apply Carbon colours
    ADMINISTRATOR:::carbonPink
    FRONTEND_APPLICATION:::carbonGreen
    BACKEND_SERVICE:::carbonGreen
    EXTERNAL_IDENTITY_PROVIDER:::carbonBlue

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616