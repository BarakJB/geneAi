#!/bin/bash

echo "🚀 מעדכן CloudFront distribution עם הדומיין החדש..."

# נקבל את ה-ETag הנוכחי
ETAG=$(aws cloudfront get-distribution-config --id EQ6TXB0TVC4ZZ --query 'ETag' --output text)
echo "ETag נוכחי: $ETAG"

# נעדכן את הקונפיגורציה עם הדומיין החדש
cat > updated-distribution-config.json << 'EOF'
{
    "CallerReference": "2ae15841-a28b-4bb6-72cc-fb0f76eb9ec4",
    "Aliases": {
        "Quantity": 2,
        "Items": [
            "geneai.co.il",
            "www.geneai.co.il"
        ]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "hostingS3Bucket",
                "DomainName": "agent-20250824235128-hostingbucket-dev.s3.eu-central-1.amazonaws.com",
                "OriginPath": "",
                "CustomHeaders": {
                    "Quantity": 0
                },
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/E1QPHCJBEAF76Y",
                    "OriginReadTimeout": 30
                },
                "ConnectionAttempts": 3,
                "ConnectionTimeout": 10,
                "OriginShield": {
                    "Enabled": false
                },
                "OriginAccessControlId": ""
            }
        ]
    },
    "OriginGroups": {
        "Quantity": 0
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "hostingS3Bucket",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "TrustedKeyGroups": {
            "Enabled": false,
            "Quantity": 0
        },
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            },
            "Headers": {
                "Quantity": 0
            }
        },
        "Compress": true,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "SmoothStreaming": false,
        "FieldLevelEncryptionId": "",
        "RealtimeLogConfigArn": "",
        "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
        "OriginRequestPolicyId": ""
    },
    "CacheBehaviors": {
        "Quantity": 0
    },
    "Comment": "",
    "Enabled": true,
    "ViewerCertificate": {
        "ACMCertificateArn": "arn:aws:acm:us-east-1:257402714973:certificate/c6ede3b0-728d-4e7b-acb1-490423e7c2cf",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021",
        "IncludeSubdomains": false
    },
    "Restrictions": {
        "GeoRestriction": {
            "RestrictionType": "none",
            "Quantity": 0
        }
    },
    "PriceClass": "PriceClass_All",
    "HttpVersion": "http2",
    "IsIPV6Enabled": true,
    "Staging": false,
    "WebACLId": ""
}
EOF

echo "📝 מעדכן CloudFront distribution..."
aws cloudfront update-distribution \
    --id EQ6TXB0TVC4ZZ \
    --if-match "$ETAG" \
    --distribution-config file://updated-distribution-config.json

if [ $? -eq 0 ]; then
    echo "✅ CloudFront distribution עודכן בהצלחה!"
    echo "⏳ יתפשט תוך 5-15 דקות..."
    echo ""
    echo "🎯 השלב הבא: הוספת A Records ב-MyNames"
else
    echo "❌ שגיאה בעדכון CloudFront distribution"
fi
