#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

projects=(
    "micro-sme-invoice-manager-06"
    "healthcare-dashboard-07"
    "ai-copywriter-08"
    "uptime-monitor-09"
    "ada-compliance-checker-10"
    "rent-agreement-generator-11"
    "supplier-verification-smes-12"
    "freelancer-payment-protection-13"
    "freelanceos-14"
)

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
    else
        echo -e "${RED}Directory $dir not found, skipping.${NC}"
    fi
done

echo -e "${GREEN}All deployments complete.${NC}"
