# EduMerge – Content Aggregator

**EduMerge** is a full-stack platform that aggregates and delivers educational content from multiple sources. Built with **Django, React, and Tailwind**, the system provides **JWT-authenticated and OAuth-enabled role-based access control** (3 distinct roles) for secure and structured content management.

The backend integrates **MongoDB** for fast, large-scale ingestion and **MySQL** for structured metadata, enabling smooth handling of both unstructured and relational data. A **Selenium-powered scraping pipeline** automates ingestion of 1000+ courses from MIT OCW and YouTube APIs, syncing with **90%+ accuracy in under 2 minutes**. Video uploads are supported via **AWS S3** and streamed efficiently through **Cloudflare Stream**, powering a catalog of 100+ user-uploaded lectures.
