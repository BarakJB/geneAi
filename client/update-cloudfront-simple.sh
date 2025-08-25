#!/bin/bash

echo "🚀 מעדכן CloudFront עם הדומיין החדש..."

# קבלת ETag נוכחי
ETAG=$(aws cloudfront get-distribution-config --id EQ6TXB0TVC4ZZ --query 'ETag' --output text)
echo "ETag נוכחי: $ETAG"

# קבלת הקונפיגורציה הנוכחית ועדכונה
aws cloudfront get-distribution-config --id EQ6TXB0TVC4ZZ --query 'DistributionConfig' > current-config.json

# יצירת קונפיגורציה מעודכנת עם jq
cat current-config.json | jq '.Aliases = {
    "Quantity": 2,
    "Items": ["geneai.co.il", "www.geneai.co.il"]
} | .ViewerCertificate = {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:257402714973:certificate/c6ede3b0-728d-4e7b-acb1-490423e7c2cf",
    "SSLSupportMethod": "sni-only", 
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "CertificateSource": "acm"
}' > updated-config.json

echo "📝 מעדכן CloudFront distribution..."
aws cloudfront update-distribution \
    --id EQ6TXB0TVC4ZZ \
    --if-match "$ETAG" \
    --distribution-config file://updated-config.json

if [ $? -eq 0 ]; then
    echo "✅ CloudFront distribution עודכן בהצלחה!"
    echo "⏳ יתפשט תוך 5-15 דקות..."
    echo ""
    echo "🎯 השלב הבא: הוספת DNS records סופיים"
else
    echo "❌ שגיאה בעדכון CloudFront distribution"
fi

