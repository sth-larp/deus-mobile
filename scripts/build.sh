#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  sudo gem install cocoapods
  pod setup
  ionic cordova platform add ios --noresources --no-interactive --verbose
  cp GoogleService-Info.plist "platforms/ios/Deus LARP 2017/Resources/Resources"
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json --no-interactive --verbose
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  mkdir -p /usr/local/android-sdk/licenses/
  sudo echo 8933bad161af4178b1185d1a37fbf41ea5269c55 > /usr/local/android-sdk/licenses/android-sdk-license
  ionic cordova platform add android --noresources --no-interactive --verbose
  ionic cordova build android --device --no-interactive --verbose
fi
