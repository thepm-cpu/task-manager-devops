#!/bin/bash

# Simple monitoring script
while true; do
    echo "$(date): Checking application health..."
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Containers are running"
    else
        echo "❌ Some containers are down"
        docker-compose ps
    fi
    
    # Check application endpoint
    if curl -f -s http://localhost:8080/health > /dev/null; then
        echo "✅ Application health check passed"
    else
        echo "❌ Application health check failed"
    fi
    
    echo "---"
    sleep 60
done
