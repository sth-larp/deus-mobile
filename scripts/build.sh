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
  sudo echo d56f5187479451eabf01fb78af6dfcb131a6481e > /usr/local/android-sdk/licenses/android-sdk-license
  ionic cordova platform add android --noresources --no-interactive --verbose
  ionic cordova build android --device --no-interactive --verbose
fi
