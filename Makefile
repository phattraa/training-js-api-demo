# Makefile for JavaScript API Microservice

# Configuration
PORT ?= 3000
NAME = javascript-api
LINT = npm run lint
TEST = npm run test
TEST_WATCH = npm run test:watch
RUN = npm start
DEV = npm run dev

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

.PHONY: help setup install lint test test-watch run dev clean all

# Default target
help:
	@echo "$(GREEN)Available targets:$(NC)"
	@echo "  make setup      - Install dependencies and setup environment"
	@echo "  make install    - Install npm dependencies"
	@echo "  make lint       - Run ESLint to check code style"
	@echo "  make test       - Run test suite"
	@echo "  make test-watch - Run tests in watch mode"
	@echo "  make run        - Start server in production mode"
	@echo "  make dev        - Start server in development mode (with auto-reload)"
	@echo "  make clean      - Remove generated files and dependencies"
	@echo "  make all        - Run setup, lint, and test"

# Setup: install dependencies and create .env if it doesn't exist
setup: install
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env 2>/dev/null || echo "$(YELLOW)Warning: .env.example not found$(NC)"; \
	fi
	@echo "$(GREEN)$(NAME) Setup complete$(NC)"

# Install npm dependencies
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@npm install > /dev/null 2>&1
	@echo "$(GREEN)Dependencies installed$(NC)"

# Run linting
lint:
	@echo "$(GREEN)Running linter...$(NC)"
	@$(LINT)

# Run tests
test:
	@echo "$(GREEN)Running tests...$(NC)"
	@$(TEST)

# Run tests in watch mode
test-watch:
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	@$(TEST_WATCH)

# Run server in production mode
run:
	@echo "$(GREEN)Starting server on port $(PORT)...$(NC)"
	@PORT=$(PORT) $(RUN)

# Run server in development mode (with auto-reload)
dev:
	@echo "$(GREEN)Starting development server on port $(PORT)...$(NC)"
	@PORT=$(PORT) $(DEV)

# Clean generated files
clean:
	@echo "$(YELLOW)Cleaning generated files...$(NC)"
	@rm -vf junit.xml
	@rm -rvf node_modules
	@rm -rvf coverage
	@rm -vf *.log
	@rm -vf *.tgz
	@echo "$(GREEN)Clean complete$(NC)"

# Run setup, lint, and test
all: setup lint test
	@echo "$(GREEN)All checks passed!$(NC)"
