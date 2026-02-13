## parts

- `brokencrystals` is the vulnerable app to be attacked
- ^^ was instrumented with opentelemetry and log forwarding via filebeat to report into a local elastic cluster, mostly by claude code
- `elastic-start-local` has the config files for that cluster
- `ngrok` is used to create an exposed port to attack

## setup
