IMAGE_NAME = competition-recorder
ENV_FILE = .env
CONTAINER_NAME = competition-recorder-container

# Get container ID if running (empty if not running)
CONTAINER_ID = $(shell docker ps -q -f name=$(CONTAINER_NAME))
# Get all container IDs (running or not)
ALL_CONTAINER_IDS = $(shell docker ps -a -q -f name=$(CONTAINER_NAME))

# Default target: build and run
all: build run

# Build the Docker image
build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) .

# Run the container with environment variables
run:
	@echo "Running container..."
	@if [ -z "$(CONTAINER_ID)" ]; then \
		docker run --name $(CONTAINER_NAME) --env-file $(ENV_FILE) -d $(IMAGE_NAME); \
	else \
		echo "Container is already running with ID: $(CONTAINER_ID)"; \
	fi

# View logs of the container
logs:
	@if [ -z "$(CONTAINER_ID)" ]; then \
		echo "No running container found"; \
	else \
		echo "Showing logs for container: $(CONTAINER_ID)"; \
		docker logs $(CONTAINER_ID); \
	fi

# Follow logs of the container
logs-follow:
	@if [ -z "$(CONTAINER_ID)" ]; then \
		echo "No running container found"; \
	else \
		echo "Following logs for container: $(CONTAINER_ID)"; \
		docker logs -f $(CONTAINER_ID); \
	fi

# Stop and remove the container
down:
	@if [ -n "$(ALL_CONTAINER_IDS)" ]; then \
		echo "Stopping and removing containers..."; \
		docker stop $(ALL_CONTAINER_IDS) 2>/dev/null || true; \
		docker rm $(ALL_CONTAINER_IDS) 2>/dev/null || true; \
		echo "Containers removed"; \
	else \
		echo "No containers found"; \
	fi

# Rebuild and restart the container
restart: down build run

# Show container status
status:
	@echo "Container status:"
	@if [ -z "$(CONTAINER_ID)" ]; then \
		echo "Container is not running"; \
		if [ -n "$(ALL_CONTAINER_IDS)" ]; then \
			echo "Stopped containers:"; \
			docker ps -a -f name=$(CONTAINER_NAME); \
		fi; \
	else \
		echo "Container is running:"; \
		docker ps -f name=$(CONTAINER_NAME); \
	fi

.PHONY: all build run logs down restart