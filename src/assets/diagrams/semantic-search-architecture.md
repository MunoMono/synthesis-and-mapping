---
config:
  layout: dagre
---
flowchart TD
    ITEM["Artefact Item (represents a single artefact with title, description, date, and provenance)"]:::carbonGreen
    
    MEDIA["Media Asset (stores images, audio, video, or documents linked to an artefact)"]:::carbonYellow
    AGENT["Agent (a person or organisation associated with an artefact, e.g. creator, contributor)"]:::carbonBlue
    TERM["Controlled Vocabulary Term (structured taxonomy terms used for classification)"]:::carbonBlue
    TAG["Curator Tag (free-form labels applied by administrators)"]:::carbonBlue
    AUDIT["Audit Record (logs who changed what and when for provenance)"]:::carbonYellow

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