# Backend System Architecture & Data Aggregation Pipeline

This document details the architectural layout, data-flow models, and relational database aggregation strategies engineered to power the E-Commerce Analytics Suite.

---

## 1. System Topology & Request Lifecycle

The API gateway implements an asynchronous decoupled architecture built on Node.js and Express. It enforces strict separation of concerns across a modular Layered Architecture:

```text
[ Client SPA ] ──( HTTP Request + JWT Bearer )──> [ Express Routing Table ]
                                                            │
                                                   [ Validation Middleware ]
                                                            │
                                                   [ Auth Guard Interceptor ]
                                                            │
                                                   [ Controller Layer ]
                                                            │
                                                   [ Relational Data Model ]
                                                            │
[ Client UI Client View ] <──( Aggregated JSON )─── [ PostgreSQL Database ]
```
