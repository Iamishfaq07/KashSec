# Data Broker Opt-Outs

Every earlier lesson in this path covered data you actively or passively generate yourself. This lesson covers something different and often surprising to newcomers: an entire industry that exists specifically to collect, aggregate, and sell that information — often without you ever directly interacting with the companies doing it.

:::danger
Data brokers are frequently the actual source behind "how did they find my home address" moments — not a data breach, not carelessness, but a legal industry whose entire business model is compiling exactly this kind of information and selling access to it.
:::

## What a data broker actually is

A **data broker** is a company that collects personal information from public records, purchased data, and other sources, then aggregates and sells it — to advertisers, to background-check services, and in many cases directly to anyone willing to pay a small fee through a public-facing "people search" website. Unlike a service you knowingly sign up for, most people have never directly interacted with the data brokers holding information about them at all.

## Where data brokers actually get their information

- **Public records** — property records, voter registration, court records, and other government data that's technically public but was never designed to be aggregated into an easily searchable personal profile
- **Purchased data** — brokers buy data from other companies (retailers, apps, other brokers), building increasingly detailed profiles by combining information from many separate sources
- **Web scraping** — automated collection of publicly visible information, including exactly the kind of social media posts the oversharing lesson covered

## Why this matters beyond "creepy people-search sites"

Data broker profiles are a genuine, documented resource in real-world stalking, harassment, and doxxing incidents — precisely because they compile scattered, individually-low-risk pieces of public information (the digital-footprint lesson's aggregation risk, at industrial scale) into a single, easily purchased profile including home address, phone number, relatives' names, and more. Domestic violence survivors and other at-risk individuals are disproportionately affected by exactly this kind of aggregation, which is part of why several jurisdictions have begun passing specific data-broker regulation.

## The opt-out process: real, but genuinely tedious

Most data brokers offer an **opt-out** process — but there's no single master switch, since dozens (sometimes hundreds) of separate broker companies each maintain their own database and their own separate opt-out procedure:

1. **Identify which brokers currently list you** — searching your own name plus your city is a reasonable starting point
2. **Submit opt-out requests individually** — each broker has its own process, typically requiring identity verification and sometimes a waiting period
3. **Expect re-listing over time** — brokers frequently re-scrape and re-add information, meaning opt-outs generally aren't a one-time action but need periodic repeating

:::tip Paid removal services exist, and are a legitimate time-saver
Given the genuinely tedious nature of individual opt-outs, several legitimate services (DeleteMe being a widely-known example) handle the opt-out process across many brokers on your behalf for a subscription fee — a reasonable tradeoff for anyone who values their time over doing dozens of individual manual opt-outs themselves.
:::

## Your legal standing varies significantly by location

Some jurisdictions (California's CCPA, several other US states, and the EU's GDPR, covered in the next lesson) grant residents specific, legally enforceable rights to request deletion of their data from brokers, with real penalties for non-compliance. In jurisdictions without this kind of specific protection, opt-outs remain available from most major brokers as a voluntary practice, but without the same legal backing behind the request.

:::challenge Reason about limits
Someone completes opt-out requests with the twenty largest data broker sites they could find, and six months later discovers their information has reappeared on several of the same sites, plus a few new ones they hadn't seen before.

<details><summary>Hint</summary>Given how data brokers actually source their information (public records, purchased data, web scraping), does a one-time opt-out realistically stay effective indefinitely?</details>
<details><summary>Show answer</summary>This outcome is expected, not a sign the opt-out failed. Data brokers continuously re-scrape public records and purchase newly available data, meaning information can genuinely reappear even after a successful opt-out — and new broker companies enter the market over time, meaning "the twenty largest" from six months ago isn't necessarily a complete or current list. This is exactly why this lesson frames opt-outs as an ongoing practice rather than a one-time task, and why paid removal services (which handle re-submission over time as part of their subscription) offer real practical value for anyone unwilling to repeat this process manually and indefinitely on their own.</details>
:::

## 🧪 Hands-on lab — check your own exposure

Search your own name plus your city on a general search engine and check whether any "people search" style results appear. If you find one, locate that specific site's opt-out page and note what information it requires to process the request (without necessarily completing it if you're not comfortable submitting identity verification to that specific site).

:::challenge Test yourself
1. Why is a data broker meaningfully different from a service you knowingly signed up for?
2. Why does an opt-out from one data broker not protect you from all the others?
3. Why might information reappear on a broker site even after a successful opt-out?
:::

## Key terms

- **Data broker** — a company that collects, aggregates, and sells personal information, often without the individual's direct knowledge.
- **Opt-out** — a request to a data broker to remove your information from their database, generally requiring periodic repetition.

## Recap

Data brokers compile scattered, individually-public information into easily purchased profiles — home address, phone number, relatives — representing the digital-footprint lesson's aggregation risk at industrial, commercial scale. Opting out is a real, available process, but it's genuinely tedious (no single master opt-out exists) and needs periodic repetition as brokers re-scrape and new brokers emerge, making paid removal services a legitimate option for anyone who'd rather not repeat dozens of manual opt-outs indefinitely themselves.

???refs
- [Privacy Rights Clearinghouse — Data Broker List](https://privacyrights.org/data-brokers) — a maintained list of major data brokers and their opt-out procedures
???

**Next up →** [Identity Theft Protection](#/lesson/09-digital-privacy/identity-theft-protection)
