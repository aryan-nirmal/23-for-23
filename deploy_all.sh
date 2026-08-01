#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

LOCKFILE="/tmp/vercel_deploy_all.lock"
if [ -e "$LOCKFILE" ]; then
    echo -e "${RED}Error: Another deployment process is currently running.${NC}"
    exit 1
fi
touch "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

DRY_RUN=false
for arg in "$@"; do
    if [ "$arg" == "--dry-run" ] || [ "$arg" == "-d" ]; then
        DRY_RUN=true
    fi
done

# Auto-detect Next.js directories in the workspace
projects=()
for d in *-[0-9][0-9]/; do
    d=${d%/}
    if [ -f "$d/package.json" ] && grep -q '"next"' "$d/package.json"; then
        projects+=("$d")
    fi
done

if [ ${#projects[@]} -eq 0 ]; then
    echo -e "${RED}No Next.js projects detected in workspace root.${NC}"
    exit 1
fi

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}=== DRY RUN MODE ===${NC}"
    for dir in "${projects[@]}"; do
        echo -e "Would deploy: ${GREEN}$dir${NC}"
    done
    exit 0
fi

# Prepare markdown report
REPORT_FILE="deploy_report.md"
echo "# Vercel Deployment Report" > "$REPORT_FILE"
echo "Generated on: $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Project Directory | Deployment Status | Production URL |" >> "$REPORT_FILE"
echo "|-------------------|-------------------|----------------|" >> "$REPORT_FILE"

for dir in "${projects[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Deploying $dir...${NC}"
        cd "$dir"
        
        # Deploy using vercel CLI, capture output to parse the production URL
        OUTPUT=$(npx vercel --prod --yes 2>&1)
        if [ $? -eq 0 ]; then
            URL=$(echo "$OUTPUT" | grep -oE 'https://[a-zA-Z0-9-]+\.vercel\.app' | head -n 1)
            if [ -z "$URL" ]; then
                URL="Link parsed from logs unavailable"
            fi
            echo -e "${GREEN}Deployment for $dir succeeded: $URL${NC}"
            echo "| $dir | 🟢 Success | [$URL]($URL) |" >> "../$REPORT_FILE"
        else
            echo -e "${RED}Deployment for $dir failed.${NC}"
            echo "| $dir | 🔴 Failed | Build logs error |" >> "../$REPORT_FILE"
        fi
        
        cd ..
    fi
done

echo -e "${GREEN}All deployments complete. Report written to $REPORT_FILE.${NC}"
