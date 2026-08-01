#!/bin/bash

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
        echo "Deploying $dir..."
        cd "$dir"
        
        # Deploy using vercel CLI, capture output to parse the production URL
        OUTPUT=$(npx vercel --prod --yes)
        echo "$dir deployment complete: $OUTPUT"
        echo "$dir: $OUTPUT" >> ../deploy_urls.txt
        
        cd ..
    else
        echo "Directory $dir not found, skipping."
    fi
done

echo "All deployments complete."
