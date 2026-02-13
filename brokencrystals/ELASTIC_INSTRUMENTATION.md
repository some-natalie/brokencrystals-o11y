# Elastic Instrumentation for BrokenCrystals Services

This document describes the Elastic observability instrumentation added to the BrokenCrystals application stack.

## Instrumented Services

The following services now send logs to the local Elasticsearch cluster:

1. **postgres (db)** - Main PostgreSQL database
2. **keycloak-db** - Keycloak PostgreSQL database
3. **keycloak** - Identity and access management
4. **grpcwebproxy** - gRPC Web proxy
5. **mailcatcher** - Email testing service
6. **nodejs** - BrokenCrystals application server
7. **ollama** - AI model serving

## Architecture

Each service has been instrumented using **Filebeat** sidecar containers that:
- Collect container logs from Docker
- Add metadata (service name, type)
- Ship logs to the local Elasticsearch cluster at `http://host.docker.internal:9200`

## Configuration Files

Filebeat configurations are located in `config/filebeat/`:
- `postgres.yml` - PostgreSQL main database
- `keycloak-db.yml` - Keycloak database
- `keycloak.yml` - Keycloak service
- `grpcwebproxy.yml` - gRPC Web proxy
- `mailcatcher.yml` - Mail catcher service
- `nodejs.yml` - BrokenCrystals application
- `ollama.yml` - AI model server

## Elasticsearch Connection

All Filebeat instances connect to:
- **Host**: `http://host.docker.internal:9200`
- **Username**: `elastic`
- **Password**: `Tn99rhPs` (from elastic-start-local/.env)

## Index Patterns

Logs are stored in daily indices:
- `filebeat-postgres-YYYY.MM.DD`
- `filebeat-keycloak-db-YYYY.MM.DD`
- `filebeat-keycloak-YYYY.MM.DD`
- `filebeat-grpcwebproxy-YYYY.MM.DD`
- `filebeat-mailcatcher-YYYY.MM.DD`
- `filebeat-nodejs-YYYY.MM.DD`
- `filebeat-ollama-YYYY.MM.DD`

## Usage

### Starting the Stack

1. Start the Elastic cluster first:
   ```bash
   cd ../elastic-start-local
   ./start.sh
   ```

2. Start the BrokenCrystals stack:
   ```bash
   cd ../brokencrystals
   docker-compose -f compose.yml up -d
   # OR for local development:
   docker-compose -f compose.local.yml up -d
   ```

### Verifying Log Collection

1. Open Kibana at `http://localhost:5601`
2. Navigate to **Management** → **Stack Management** → **Index Management**
3. Look for indices matching `filebeat-*` patterns
4. Create Data Views in **Management** → **Stack Management** → **Kibana** → **Data Views** for each service
5. View logs in **Analytics** → **Discover**

### Checking Filebeat Status

Check if Filebeat containers are running:
```bash
docker ps | grep filebeat
```

Check Filebeat logs:
```bash
docker logs filebeat-postgres
docker logs filebeat-keycloak
docker logs filebeat-keycloak-db
docker logs filebeat-grpcwebproxy
docker logs filebeat-mailcatcher
docker logs filebeat-nodejs
docker logs filebeat-ollama
```

### Querying Logs via API

You can verify data is being sent:
```bash
# Check indices exist
curl -u elastic:ni0qgFz8 http://localhost:9200/_cat/indices/filebeat-*?v

# Query recent logs from postgres
curl -u elastic:ni0qgFz8 http://localhost:9200/filebeat-postgres-*/_search?pretty

# Count documents
curl -u elastic:ni0qgFz8 http://localhost:9200/filebeat-postgres-*/_count
```

## Network Configuration

All instrumented services have:
- `extra_hosts` configured with `host.docker.internal:host-gateway` to resolve the host machine
- Labels `co.elastic.logs/enabled: "true"` for Filebeat autodiscovery

## Volumes

Persistent volumes for Filebeat data:
- `filebeat-postgres-data`
- `filebeat-keycloak-db-data`
- `filebeat-keycloak-data`
- `filebeat-grpcwebproxy-data`
- `filebeat-mailcatcher-data`
- `filebeat-nodejs-data`
- `filebeat-ollama-data`

## Troubleshooting

### Logs not appearing in Elasticsearch

1. Check Filebeat container is running and healthy
2. Verify Elasticsearch is accessible from Docker containers:
   ```bash
   docker exec filebeat-postgres curl -u elastic:ni0qgFz8 http://host.docker.internal:9200
   ```
3. Check Filebeat logs for connection errors
4. Ensure the Elastic cluster is running and healthy

### Connection refused errors

- Make sure the Elastic cluster is started before the BrokenCrystals stack
- Verify port 9200 is exposed and accessible
- Check Docker networking configuration

### No data in indices

- Services may not be generating logs yet - interact with the applications to generate activity
- Check that container logs are being written: `docker logs <service-name>`
- Verify Filebeat has permissions to read Docker socket

## Advanced Configuration

### Changing Elasticsearch Connection

To point to a different Elasticsearch cluster, update the `output.elasticsearch.hosts` and credentials in each Filebeat YAML file in `config/filebeat/`.

### Adding More Services

To instrument additional services:

1. Create a Filebeat config file in `config/filebeat/<service-name>.yml`
2. Add a Filebeat sidecar service in the compose file
3. Add the service-specific volume to the volumes section
4. Add `extra_hosts` and labels to the target service

### Customizing Log Processing

Edit the `processors` section in each Filebeat YAML to:
- Add additional metadata fields
- Filter or transform log messages
- Parse specific log formats
