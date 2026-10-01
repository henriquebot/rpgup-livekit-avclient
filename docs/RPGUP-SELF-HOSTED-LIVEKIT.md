# RPG Up self-hosted LiveKit notes

This document records the self-hosted LiveKit setup and the troubleshooting done for the RPG Up Foundry VTT deployment.

No API keys, secrets, tokens, or other credentials belong in this repository.

## Transport layout

The tested deployment uses:

- LiveKit signaling/API internally on `7880/TCP`, exposed through HTTPS/WSS by the reverse proxy.
- WebRTC media on `7882/UDP` when a direct UDP path is available.
- WebRTC TCP fallback on `7881/TCP`.
- Built-in TURN on `3478/UDP`.
- TURN relay ports restricted to `30000-30100/UDP`.

For Docker bridge networking, the TURN relay range must be explicitly published by the container. The same range must also be allowed by the VM/cloud firewall.

Example LiveKit TURN configuration:

```yaml
turn:
  enabled: true
  udp_port: 3478
  relay_range_start: 30000
  relay_range_end: 30100
```

Example Docker port publishing:

```yaml
ports:
  - "7881:7881/tcp"
  - "7882:7882/udp"
  - "3478:3478/udp"
  - "30000-30100:30000-30100/udp"
```

## What was verified

During diagnostics, relay-only ICE was temporarily forced in the Foundry client.

This proved that:

- TURN candidates were successfully created in the configured `30000-30100` range.
- Publishing only `3478/UDP` is not sufficient; the relay data ports also need to be reachable.
- Once the relay range was published and opened, TURN could carry the session.
- A temporary host-level DROP rule for `7882/UDP` was used to force the test and was later removed.

The relay-only client mode was diagnostic only. It is removed in `0.6.9-rpgup.8`.

## Mobile-network result

The tested 5G route showed heavy bandwidth variation. LiveKit bandwidth estimates repeatedly dropped into roughly the 100-400 kbps range during motion. That explained why a stationary webcam could look acceptable while motion became soft or unstable.

This was a network-path limitation, not evidence that the VM CPU/RAM was exhausted.

Operationally:

- Wi-Fi is the recommended path for players who enable webcam video.
- Mobile-data webcam use should be treated as best-effort.
- Discord can continue to carry voice independently.

## Current production client profile

Version `0.6.9-rpgup.8` uses:

- VP9
- SVC `L3T3_KEY`
- 4:3 720p capture
- up to 30 fps
- 1.8 Mbps maximum video bitrate
- `degradationPreference: "balanced"`
- Adaptive Stream enabled
- Dynacast enabled
- normal ICE selection (no forced relay)

This means the browser is allowed to select the best available ICE path. TURN is a fallback rather than being forced for every participant.

## Firewall state after diagnostics

During TURN testing, the public firewall rules for `7881/TCP` and `7882/UDP` were temporarily removed.

They should only be restored when testing/using direct media again. The module itself does not require those ports to be open in order to attempt TURN; however, leaving them closed prevents normal direct media from being selected.

Before changing production firewall rules, verify the current cloud firewall state rather than assuming these notes still match it.

## Future work

Potential next steps, intentionally not implemented in this release:

- Optional automatic LiveKit Cloud -> self-hosted failover.
- A GM-visible notice when the active A/V backend changes.
- Experimental VDO.Ninja integration for higher-quality OBS-oriented remote video.
