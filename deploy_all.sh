#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

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

echo "Starting mass Vercel deployment..." > deploy_urls.txt

for dir in "${projects[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Deploying $dir...${NC}"
        cd "$dir"
        
        # Deploy using vercel CLI, capture output to parse the production URL
        OUTPUT=$(npx vercel --prod --yes)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Deployment for $dir succeeded.${NC}"
        else
            echo -e "${RED}Deployment for $dir failed.${NC}"
        fi
        echo "$dir: $OUTPUT" >> ../deploy_urls.txt
        
        cd ..
    fi
done

echo -e "${GREEN}All deployments complete.${NC}"
