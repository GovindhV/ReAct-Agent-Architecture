#!/bin/bash

# Database Backup Script
# Creates timestamped backups of the SQLite database

set -e

# Configuration
DB_FILE="react_calendar.db"
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
DAYS_TO_KEEP=30

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "🔄 Starting database backup..."
echo ""

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    print_success "Created backup directory"
fi

# Check if database exists
if [ ! -f "$DB_FILE" ]; then
    print_error "Database file not found: $DB_FILE"
    exit 1
fi

# Create SQL dump
print_info "Creating SQL dump..."
if sqlite3 "$DB_FILE" .dump > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_success "Backup created: $BACKUP_FILE ($BACKUP_SIZE)"
else
    print_error "Failed to create backup"
    exit 1
fi

# Also create a binary copy
BINARY_BACKUP="${BACKUP_DIR}/backup_${TIMESTAMP}.db"
if cp "$DB_FILE" "$BINARY_BACKUP"; then
    BINARY_SIZE=$(du -h "$BINARY_BACKUP" | cut -f1)
    print_success "Binary backup created: $BINARY_BACKUP ($BINARY_SIZE)"
fi

# Compress backups
print_info "Compressing backups..."
if gzip -f "$BACKUP_FILE"; then
    print_success "SQL backup compressed: ${BACKUP_FILE}.gz"
fi

if gzip -f "$BINARY_BACKUP"; then
    print_success "Binary backup compressed: ${BINARY_BACKUP}.gz"
fi

# Clean up old backups
print_info "Cleaning up old backups (keeping last $DAYS_TO_KEEP days)..."
find "$BACKUP_DIR" -name "backup_*.gz" -mtime +$DAYS_TO_KEEP -delete
REMAINING=$(find "$BACKUP_DIR" -name "backup_*.gz" | wc -l)
print_success "Cleanup complete. $REMAINING backup(s) remaining"

# Display backup summary
echo ""
echo "════════════════════════════════════════"
echo "Backup Summary"
echo "════════════════════════════════════════"
echo "Timestamp: $TIMESTAMP"
echo "SQL Backup: ${BACKUP_FILE}.gz"
echo "Binary Backup: ${BINARY_BACKUP}.gz"
echo "Total Backups: $REMAINING"
echo "════════════════════════════════════════"
echo ""

# Optional: Upload to cloud storage (uncomment if needed)
# print_info "Uploading to cloud storage..."
# aws s3 cp "${BACKUP_FILE}.gz" s3://your-bucket/backups/
# print_success "Uploaded to S3"

exit 0