# ---------------------------------------
# Development stage
# ---------------------------------------
FROM redis AS development
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM redis AS production
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]