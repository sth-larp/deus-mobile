#!/bin/sh
if [[ -z "$CERT_PASSWORD" ]]; then  
    echo "Error: Missing password for adding private key"
    exit 1
fi

echo "Creating keychain"
security create-keychain -p travis ios-build.keychain

security default-keychain -s ios-build.keychain

security unlock-keychain -p travis ios-build.keychain

security set-keychain-settings -t 3600 -u ios-build.keychain

echo "Import Apple cert"
security import ./scripts/certs/apple.cer -k ios-build.keychain -T /usr/bin/codesign

echo "Import developer cert"
security import ./scripts/certs/AppleDeveloper.p12 -k ios-build.keychain -P $CERT_PASSWORD -T /usr/bin/codesign

echo "Import distribution cert"
security import ./scripts/certs/AppleDistribution.p12 -k ios-build.keychain -P $CERT_PASSWORD -T /usr/bin/codesign

echo "Import APNS cert"
security import ./scripts/certs/APNS-AppDev.p12 -k ios-build.keychain -P $CERT_PASSWORD -T /usr/bin/codesign

security set-key-partition-list -S apple-tool:,apple: -s -k travis ios-build.keychain

mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles

cp "./scripts/profile/$PROFILE_NAME.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/  
