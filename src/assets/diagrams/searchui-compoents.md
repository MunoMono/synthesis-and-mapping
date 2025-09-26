---
config:
  layout: dagre
---
flowchart TD
    UI["Search User Interface (React application styled with IBM Carbon Design System)"]:::carbonGreen
    
    UI --> SEARCH["Search Box (Carbon Search component)"]:::carbonGreen
    UI --> FILTER["Filter Panel (Carbon Accordion with MultiSelect controls)"]:::carbonGreen
    UI --> RESULTS["Results Table (Carbon DataTable for search results)"]:::carbonGreen
    UI --> RELATED["Related Items Rail (Carbon ClickableTile grid for recommended artefacts)"]:::carbonGreen

    SEARCH --> RESULTS
    FILTER --> RESULTS
    RESULTS --> RELATED

    %% Carbon theme classes
    UI:::carbonGreen
    SEARCH:::carbonGreen
    FILTER:::carbonGreen
    RESULTS:::carbonGreen
    RELATED:::carbonGreen

    classDef carbonDefault fill:#161616,stroke:#393939,color:#f4f4f4
    classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
    classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
    classDef carbonRed fill:#ff7d79,stroke:#393939,color:#161616
    classDef carbonGreen fill:#42be65,stroke:#393939,color:#161616
    classDef carbonYellow fill:#f1c21b,stroke:#393939,color:#161616