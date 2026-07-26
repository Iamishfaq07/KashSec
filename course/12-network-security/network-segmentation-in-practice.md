# Network Segmentation in Practice

Path 02 introduced VLANs; Path 24's micro-segmentation lesson covered the Zero Trust theory. This lesson bridges the two — how segmentation actually gets designed and implemented as a real defensive strategy, not just a concept.

## Segmentation as an active defense, not just organization

Earlier coverage of VLANs framed segmentation largely as network organization. This lesson reframes it as a genuinely active security control: properly designed segmentation is one of the highest-leverage defenses against **lateral movement** — an attacker who compromises one system trying to reach others — directly connecting to the blast-radius principle this course has returned to repeatedly, from Zero Trust to cloud multi-account governance.

## Designing segments around trust boundaries, not just convenience

A common real-world mistake: segmenting a network purely along organizational lines (a "Sales VLAN," a "Marketing VLAN") without considering actual trust and sensitivity differences within those groups. A more security-driven approach segments around **data sensitivity and function**:

- A segment for general user workstations
- A separate, more restricted segment for servers holding sensitive data
- A separate, tightly controlled segment for administrative and management interfaces
- A separate segment for IoT and other lower-trust devices, directly echoing Path 02's switches-and-VLANs lesson

## The DMZ pattern, generalized beyond OT

Path 25's Purdue Model lesson introduced the DMZ concept for OT/IT separation. The same pattern applies broadly: any network segment that needs to be reachable from a lower-trust zone (the internet, a guest network) but also needs to reach a higher-trust zone (an internal database) sits in its own **DMZ**, with strict, limited rules governing exactly what can cross each boundary — never allowing a lower-trust zone to reach a higher-trust one directly.

## Segmentation and incident response, working together

Directly connecting to Path 10's incident-response lesson: well-designed segmentation makes the **containment** phase dramatically more effective — isolating a compromised segment (by adjusting firewall rules or disabling the relevant VLAN) can stop an active incident from spreading, without needing to shut down the entire network. Poor segmentation, by contrast, means containment options are limited to "isolate this one device" or "shut down everything," with no useful middle ground.

## A practical example: segmenting a small business network

1. **Guest Wi-Fi** — fully isolated, no access to any internal resource at all
2. **Employee workstations** — access to internal file shares and the internet, no direct access to servers
3. **Server segment** — reachable only from specific workstation IPs that genuinely need it, never directly from guest or general internet traffic
4. **Management segment** — reachable only from a small number of specific administrator devices, exactly the jump-host pattern Path 25's practical-controls lesson described for OT environments

:::challenge Test yourself
Why does poor network segmentation limit an organization's options during incident containment specifically, beyond just being a general security weakness?
<details><summary>Show answer</summary>The incident-response lesson's containment phase depends on being able to stop an active incident from spreading <em>without</em> having to shut down everything the organization depends on — and that selective isolation is only possible if the network is actually divided into segments a defender can meaningfully act on independently. On a flat, unsegmented network, "contain the incident" effectively means either isolating one single compromised device (which does nothing if the attacker has already spread further, silently, before detection) or disconnecting the entire network (an extreme, costly option that halts all legitimate business operations too). Well-designed segmentation gives defenders a genuine middle ground: isolate the specific segment where the incident is actually contained, based on real evidence of how far it's spread, without the false choice between "do almost nothing" and "shut down the whole organization."</details>
:::

## Key terms

- **Lateral movement** — an attacker's attempt to move from an initially compromised system to other systems on the same network.
- **DMZ (Demilitarized Zone)** — a segment mediating between a lower-trust and higher-trust zone, with strict rules governing what can cross each boundary.

## Recap

- Real segmentation design should follow data sensitivity and function, not just organizational convenience — a genuinely active defense against lateral movement, not just tidy network organization.
- The DMZ pattern from Path 25's OT material generalizes to any situation where a lower-trust zone needs limited, controlled access to a higher-trust one.
- Well-designed segmentation directly strengthens incident containment, giving defenders a genuine middle ground between isolating one device and shutting down an entire network.

**Next up →** [IDS, IPS & SIEM](#/lesson/12-network-security/ids-ips-siem)
