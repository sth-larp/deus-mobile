#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  sudo gem install cocoapods
  pod setup
  ionic cordova platform add ios --noresources --no-interactive --verbose
  cp GoogleService-Info.plist "platforms/ios/Deus LARP 2017/Resources/Resources"
  # ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  mkdir -p /usr/local/android-sdk/licenses/
  sudo echo 8933bad161af4178b1185d1a37fbf41ea5269c55 > /usr/local/android-sdk/licenses/android-sdk-license
  ionic cordova platform add android --noresources --no-interactive
  echo "key.store=../../scripts/certs/deus-larp-keystore.jks" > ./platforms/android/release-signing.properties
  echo "key.alias=deus-larp" >> ./platforms/android/release-signing.properties
  echo key.store.password=$CERT_PASSWORD >> ./platforms/android/release-signing.properties
  echo key.alias.password=$CERT_PASSWORD >> ./platforms/android/release-signing.properties
  ionic cordova build android --device --release --no-interactive
fi
