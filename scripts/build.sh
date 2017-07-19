#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  travis_wait 30 ionic cordova platform add ios --noresources --no-interactive --verbose
  cp GoogleService-Info.plist "platforms/ios/Deus LARP 2017/Resources/Resources"
  # ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  ionic cordova platform add android --noresources --no-interactive
  echo "key.store=../../scripts/certs/deus-larp-keystore.jks" > ./platforms/android/release-signing.properties
  echo "key.alias=deus-larp" >> ./platforms/android/release-signing.properties
  echo key.store.password=$CERT_PASSWORD >> ./platforms/android/release-signing.properties
  echo key.alias.password=$CERT_PASSWORD >> ./platforms/android/release-signing.properties
  ionic cordova build android --device --release --no-interactive
fi
