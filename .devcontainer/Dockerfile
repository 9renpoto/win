# See https://github.com/devcontainers/images/blob/main/src/base-trixie/.devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/base:trixie

# This Dockerfile installs Bun and textlint with its plugins globally.

# Install OS dependencies and Bun globally
USER root
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive 
    && apt-get -y install --no-install-recommends unzip curl 
    && curl -fsSL https://bun.sh/install | bash 
    && apt-get clean 
    && rm -rf /var/lib/apt/lists/*

# Add Bun to the PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Install textlint and plugins globally
RUN bun add --global 
    textlint@^15.2.2 
    textlint-filter-rule-comments@^1.2.2 
    textlint-rule-incremental-headers@^0.2.0 
    textlint-rule-ja-no-mixed-period@^3.0.1 
    textlint-rule-ja-no-successive-word@^2.0.1 
    textlint-rule-ja-no-weak-phrase@^2.0.0 
    textlint-rule-max-ten@^5.0.0 
    textlint-rule-no-dead-link@^6.0.1 
    textlint-rule-no-double-negative-ja@^2.0.1 
    textlint-rule-no-doubled-conjunction@^3.0.0 
    textlint-rule-no-doubled-conjunctive-particle-ga@^3.0.0 
    textlint-rule-no-doubled-joshi@^5.1.0 
    textlint-rule-no-dropping-the-ra@^3.0.0 
    textlint-rule-no-hankaku-kana@^2.0.1 
    textlint-rule-no-mix-dearu-desumasu@^6.0.4 
    textlint-rule-no-nfd@^2.0.2 
    textlint-rule-preset-ja-spacing@^2.4.3 
    textlint-rule-preset-jtf-style@^3.0.2

# Switch to non-root user
USER vscode

# Set working directory for the container
WORKDIR /workspaces/win
