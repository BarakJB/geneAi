#!/bin/bash

echo "🔍 בודק אימות SSL certificate..."
echo "Certificate ARN: c6ede3b0-728d-4e7b-acb1-490423e7c2cf"
echo ""

while true; do
    STATUS=$(aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:257402714973:certificate/c6ede3b0-728d-4e7b-acb1-490423e7c2cf --region us-east-1 --query 'Certificate.Status' --output text)
    
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    
    if [ "$STATUS" = "ISSUED" ]; then
        echo "✅ [$TIMESTAMP] SSL Certificate אומת בהצלחה!"
        echo "🎉 כעת ניתן להמשיך לשלב הבא - חיבור הדומיין ל-CloudFront"
        break
    elif [ "$STATUS" = "FAILED" ]; then
        echo "❌ [$TIMESTAMP] אימות SSL נכשל! בדוק את רשומות ה-DNS"
        break
    else
        echo "⏳ [$TIMESTAMP] עדיין בהמתנה לאימות... (Status: $STATUS)"
    fi
    
    sleep 60  # בדיקה כל דקה
done
