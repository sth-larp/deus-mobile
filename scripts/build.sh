#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then  
  ionic cordova platform add ios
  cp GoogleService-Info.plist platforms/ios/deus-larp-2017/Resources/Resources
  ls  platforms/ios/deus-larp-2017/Resources/Resources/
  cat platforms/ios/deus-larp-2017/Resources/Resources/*.plist
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then  
  ionic cordova platform add android
  ionic cordova build android --device
fi
