# Sofie Health Monitor

Sofie Health Monitor scrapes a list of sofie installations for health and status related information and presents these in a web-based GUI.

### Usage

Steps for running the health monitor via docker:

1. Create a hosts.json file (see hosts.example.json for structure).
2. Run `docker run -p 8080:8080 -v $(pwd)/hosts.json:/usr/src/app/data/hosts.json tv2media/sofie-health-monitor:latest`
3. Visit `http://localhost:8080`

