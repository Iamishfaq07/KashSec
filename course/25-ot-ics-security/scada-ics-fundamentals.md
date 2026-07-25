# SCADA & ICS Architecture Fundamentals

The previous lesson introduced the vocabulary. This one builds the actual mental model — what's really happening, layer by layer, between a sensor reading a physical value and an operator making a decision on a screen.

:::tip
The core loop to hold in your head throughout this entire path: **sense → decide → act**. A sensor measures something physical, a controller decides what to do about it, and an actuator physically does it. Everything else in ICS architecture is built around making that loop reliable, fast, and (ideally) secure.
:::

## The control loop, concretely

Take something as simple as keeping a tank's water level within range:

1. A **sensor** measures the current water level
2. A **PLC (Programmable Logic Controller)** reads that value and compares it against the target range
3. If the level is too low, the PLC sends a signal to an **actuator** — a pump — to turn on
4. The pump physically adds water
5. The sensor reads the new level, and the loop repeats, continuously, often many times per second

This is the fundamental unit of almost all industrial control: a fast, local, continuously repeating loop that doesn't need a human in it at all for normal operation. Humans supervise; they don't drive every individual action.

## The layers, from field to enterprise

| Layer | What lives here | Typical timescale |
|---|---|---|
| Field devices | Sensors, actuators, motors, valves | Milliseconds |
| Controllers | PLCs, RTUs (Remote Terminal Units) | Milliseconds to seconds |
| Supervisory | HMI (Human-Machine Interface), local SCADA servers | Seconds |
| Site/plant | Historian (data logging), engineering workstations | Minutes |
| Enterprise | Business systems, reporting, planning | Hours to days |

Notice the timescale column: as you move up the layers, from physical field devices toward business systems, the required response time gets slower and the systems get closer to "normal IT." This is exactly why the boundary between these layers matters so much for security — a business reporting system that's slow to respond for a few seconds is a non-event; a PLC that's slow to respond for a few seconds might mean a valve doesn't close in time.

## SCADA vs. DCS, properly explained

The previous lesson defined these briefly — here's the architectural distinction that actually matters:

- **SCADA** systems are built for processes that are geographically distributed — think a pipeline running hundreds of miles, or an electrical grid spanning a region. Communication often happens over long-distance links (radio, leased lines, cellular), and some delay/unreliability in that communication is an accepted design reality.
- **DCS** systems are built for processes concentrated in one facility — a single refinery, a single power plant. Communication is typically over a local, high-reliability network, and the control loops can be tighter and faster because everything is physically close together.

A useful analogy: SCADA is built assuming the field devices are far away and the network connecting them is inherently imperfect. DCS is built assuming everything is close together and the network is fast and reliable. Both still follow the same sense-decide-act loop underneath — the difference is scale and communication assumptions.

## HMI: where humans actually touch the system

The **Human-Machine Interface** is what an operator actually looks at — typically a screen showing a schematic of the process (tanks, pipes, valves, current readings) with the ability to issue supervisory commands (change a setpoint, acknowledge an alarm, manually override an automatic action).

:::danger
A compromised HMI is one of the most dangerous single points of failure in an ICS environment — not because the HMI itself controls the physical process directly, but because it's the trusted interface operators rely on to *understand what's happening*. An attacker who can manipulate what the HMI displays can make an operator believe everything is normal while the actual physical process is doing something dangerous. This exact pattern — a genuine physical attack paired with falsified HMI readouts to delay detection — has appeared in real-world incidents.
:::

## Historian: the ICS world's audit log

A **historian** is a specialized database that continuously logs process data over time — every sensor reading, every setpoint change, often for years. It's the OT equivalent of application logging, and it plays a similar dual role: operationally useful (trend analysis, troubleshooting, regulatory reporting) and forensically critical (reconstructing what actually happened during an incident, similar to the log-analysis skills from earlier in this course, just applied to physical process data instead of authentication logs).

## A worked example: a simplified power substation

Picture a small electrical substation:

- **Field devices**: current and voltage sensors on transmission lines, circuit breakers that can physically open (disconnect) or close (connect) a line
- **Controller**: a PLC/RTU that reads the sensors and can command a breaker to open if it detects a fault condition (like a short circuit) — this happens automatically, in milliseconds, because waiting for a human to react would be far too slow to prevent equipment damage
- **Supervisory**: an HMI showing the substation's status to an operator at a regional control center, who can also manually command a breaker to open or close for planned maintenance
- **Historian**: logging every breaker operation and every sensor reading, both for regulatory compliance and for investigating any unusual event afterward

If an attacker could reach the PLC directly and issue a false "open" command to a breaker with no fault actually present, they could deliberately cause an unnecessary power outage — this is close to the real mechanism behind actual grid-attack incidents covered later in this path.

## 🧪 Hands-on lab — trace a control loop

Pick a physical system you interact with regularly that has some form of automatic control — a home thermostat, a car's cruise control, an elevator.

1. Identify the sensor(s): what physical value is being measured?
2. Identify the controller: what's making the decision, and what's it comparing the sensor value against?
3. Identify the actuator(s): what physical action actually happens as a result?
4. Write out the full sense-decide-act loop for your chosen system, in your own words.
5. Now imagine an attacker could falsify the sensor reading your system relies on (without touching the actual physical actuator). What's the worst realistic consequence for your specific example?

:::challenge Test yourself
1. Explain the sense-decide-act loop in your own words, using a different example than the one in this lesson.
2. What's the key architectural difference between SCADA and DCS, and why does geography drive that difference?
3. Why is a compromised HMI dangerous even though it doesn't directly control physical equipment itself?
:::

## Key terms

- **PLC (Programmable Logic Controller)** — hardware that reads sensors and controls actuators based on programmed logic
- **RTU (Remote Terminal Unit)** — similar role to a PLC, typically used in geographically distributed SCADA contexts
- **HMI (Human-Machine Interface)** — the operator-facing screen for monitoring and supervisory control
- **Historian** — a specialized database logging process data over time for analysis and forensic reconstruction
- **Setpoint** — the target value a control loop tries to maintain (e.g., "keep the tank at 75% full")

## Recap

Every ICS environment, no matter how large or complex, is built on the same fundamental sense-decide-act control loop, arranged in layers from fast local field devices up to slower enterprise systems. SCADA and DCS differ mainly in geographic scope and communication assumptions, while the HMI and historian serve as the human-facing and forensic layers respectively — and both are high-value targets precisely because they shape what humans believe is happening, not just what the machinery is actually doing.

???refs
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — covers ICS architecture in depth
- [CISA — Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems) — ongoing advisories and architectural guidance
???
