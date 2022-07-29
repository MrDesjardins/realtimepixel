#!/bin/bash

# WARNING! This script deletes data!
# Run only if you do not have systems
# that pull images via manifest digest.

# FROM: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-delete

# Change to 'true' to enable image delete
ENABLE_DELETE=false

# Modify for your environment
# TIMESTAMP can be a date-time string such as 2019-03-15T17:55:00.
REGISTRY=realtimepixel 
REPOSITORY=realtimepixel_backend
TIMESTAMP=2022-07-28  

# Delete all images older than specified timestamp.

if [ "$ENABLE_DELETE" = true ]
then
    az acr manifest list-metadata --name $REPOSITORY --registry $REGISTRY \
    --orderby time_asc --query "[?lastUpdateTime < '$TIMESTAMP'].digest" -o tsv \
    | xargs -I % rm $REPOSITORY@%
else
    echo "No data deleted."
    echo "Set ENABLE_DELETE=true to enable deletion of these images in $REPOSITORY:"
    az acr manifest list-metadata --name $REPOSITORY --registry $REGISTRY \
   --orderby time_asc --query "[?lastUpdateTime < '$TIMESTAMP'].[digest, lastUpdateTime]" -o tsv
fi

exit 0

az acr repository delete --name realtimepixel --image realtimepixel_backend@sha256:805ce7d204a262d1f8d4e81d333d93770ede8690c331e80a2fcd89251af939b3

az acr manifest list-metadata --name realtimepixel_backend --registry realtimepixel --orderby time_asc --query "[?lastUpdateTime < '2022-07-28'].digest" -o tsv | xargs

az acr repository delete --name realtimepixel --image realtimepixel_backend@sha256:6790e4a85de990f65bdabf92e78c148c661069985dfd35eac5e9dea9076e7b1e


