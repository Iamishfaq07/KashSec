# Cloud Databases Basics

The storage lesson covered object storage for files. This lesson covers the cloud's other major data service: **managed databases** — structured, queryable data storage where the provider handles most of the operational burden that used to fall entirely on whoever ran the database server.

:::tip
The core value proposition of a managed database service is right there in the name: the cloud provider manages the operational burden (patching, backups, replication, failover) that a self-hosted database traditionally required a dedicated database administrator to handle manually.
:::

## Managed relational databases

Services like **Amazon RDS**, **Azure SQL Database**, and **Google Cloud SQL** run traditional relational databases (MySQL, PostgreSQL, and others) as a managed service — you get the same SQL query language and relational data model, but automated backups, patching, and high-availability replication come built in, rather than being something you have to configure and maintain yourself.

## NoSQL and other specialized database types

Beyond relational databases, cloud providers offer specialized data stores for specific access patterns:

- **Key-value / document stores** (DynamoDB, Cosmos DB, Firestore) — optimized for fast lookups by a known key, commonly used for session data, user profiles, and application state at massive scale
- **Data warehouses** (Redshift, BigQuery, Synapse) — optimized for large-scale analytical queries across huge datasets, rather than the fast, small transactional queries relational databases handle well
- **In-memory caches** (ElastiCache, Azure Cache for Redis) — extremely fast, temporary data stores used to reduce load on a primary database by serving frequently-requested data from memory instead

## Why database choice matters for security, not just performance

Different database types carry different security considerations directly relevant to concepts covered elsewhere in this course:

- **Relational databases** remain the primary target of SQL injection (Path 11 covers this hands-on) — the query language itself is exactly what an injection attack exploits
- **NoSQL databases** have their own analogous injection risks (NoSQL injection), a less commonly known but genuinely real category worth being aware of even though this course doesn't cover it in the same depth as SQL injection
- **Publicly accessible database endpoints** are a serious, surprisingly common real-world misconfiguration — a managed database that should only be reachable from within a private network, but is instead configured with a public endpoint and weak or default credentials, mirroring the exact same misconfiguration pattern the cloud-storage-basics lesson covered for buckets

## Backup and disaster recovery, done differently at cloud scale

Managed database services typically offer automated backups and **point-in-time recovery** — the ability to restore a database to its exact state at any specific moment within a retention window, not just to the most recent full backup. This is a meaningfully stronger recovery capability than most self-managed setups achieve without significant additional engineering effort, directly extending the backup principles from Path 00 and Path 07 to a much more granular level.

:::challenge Diagnose a misconfiguration
A managed relational database is found configured with a public endpoint (reachable from the internet), using the default administrator username, and a password that was never changed from the value auto-generated during setup — which the team assumed nobody would ever see since "it's just for internal use."

<details><summary>Hint</summary>Compare this to the earlier lesson's coverage of publicly-accessible storage buckets — what's the structurally identical mistake being made here, just against a different service type?</details>
<details><summary>Show answer</summary>This is the exact same structural mistake as a misconfigured public storage bucket, applied to a database instead: an assumption that "internal use" provides real protection, when the actual technical configuration (a public endpoint) makes the resource reachable by anyone on the internet regardless of intent. Combined with default credentials, this database is trivially discoverable by automated internet-wide scanning (the same "fishing with a giant net" pattern from Path 01) and trivially accessible once found. The fix mirrors the storage lesson's fix too: restrict the database to a private network endpoint reachable only from within the appropriate VPC (covered in the networking lesson), and always change default credentials immediately, regardless of how "internal" the resource is assumed to be.</details>
:::

## 🧪 Hands-on lab — match the database to the workload

For three scenarios — (1) storing user shopping cart sessions for fast lookup, (2) running analytical queries across five years of sales data, (3) storing structured customer order records with complex relationships — identify which database category from this lesson fits best, and explain why in one sentence each.

:::challenge Test yourself
1. What operational burden does a managed database service take on that a self-hosted database wouldn't?
2. Why might a NoSQL key-value store be a better fit than a relational database for session data specifically?
3. Why is a publicly accessible database endpoint considered a serious misconfiguration, structurally similar to a misconfigured storage bucket?
:::

## Key terms

- **Managed database** — a database service where the cloud provider handles operational tasks like patching, backups, and replication.
- **Point-in-time recovery** — the ability to restore a database to its exact state at any specific past moment within a retention window.
- **NoSQL database** — a non-relational database optimized for specific access patterns like key-value lookups or document storage.

## Recap

Cloud managed database services offload the operational burden of patching, backups, and replication that traditionally required dedicated database administration, while offering specialized options — relational, key-value, data warehouse, in-memory cache — matched to different access patterns. Security scrutiny for databases mirrors the storage lesson's core lesson almost exactly: public accessibility plus weak credentials is a dangerous, surprisingly common combination, regardless of how "internal" a resource was assumed to be.

???refs
- [AWS — What is Amazon RDS?](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) — the official overview of AWS's managed relational database service
???

**Next up →** [Cloud Networking Basics](#/lesson/08-cloud-basics/cloud-networking-basics)
