```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    
    Note right of browser: 201 Payload

    activate server
    server-->>browser: HTTP 201 Created (Payload)
    deactivate server

    Note right of browser: Callback to render
```
