# See https://github.com/devcontainers/images/tree/main/src/javascript-node
FROM mcr.microsoft.com/devcontainers/javascript-node:4-24-bookworm

# Install textlint and plugins globally with npm (Node runtime is preinstalled)
USER root
RUN npm install -g \
    textlint@^15.2.2 \
    textlint-filter-rule-comments@^1.2.2 \
    textlint-rule-incremental-headers@^0.2.0 \
    textlint-rule-ja-no-mixed-period@^3.0.1 \
    textlint-rule-ja-no-successive-word@^2.0.1 \
    textlint-rule-ja-no-weak-phrase@^2.0.0 \
    textlint-rule-max-ten@^5.0.0 \
    textlint-rule-no-dead-link@^6.0.1 \
    textlint-rule-no-double-negative-ja@^2.0.1 \
    textlint-rule-no-doubled-conjunction@^3.0.0 \
    textlint-rule-no-doubled-conjunctive-particle-ga@^3.0.0 \
    textlint-rule-no-doubled-joshi@^5.1.0 \
    textlint-rule-no-dropping-the-ra@^3.0.0 \
    textlint-rule-no-hankaku-kana@^2.0.1 \
    textlint-rule-no-mix-dearu-desumasu@^6.0.4 \
    textlint-rule-no-nfd@^2.0.2 \
    textlint-rule-preset-ja-spacing@^2.4.3 \
    textlint-rule-preset-jtf-style@^3.0.2 \
    && npm cache clean --force

# Switch to non-root user
USER node

# Set working directory for the container
WORKDIR /workspaces/win
