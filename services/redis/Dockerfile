# ---------------------------------------
# Development stage
# ---------------------------------------
FROM redis AS development
COPY services/redis/redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM redis AS production
COPY services/redis/redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]