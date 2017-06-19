#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then  
  ionic cordova platform add ios
  cp GoogleService-Info.plist platforms/ios/deus-larp-2017/Resources/Resources
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json
  ls  platforms/ios/deus-larp-2017/Resources/Resources/
  echo "breakpoint"
  ls  platforms/ios/deus-larp-2017/*
  cat platforms/ios/deus-larp-2017/deus-larp-2017-Info.plist
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then  
  ionic cordova platform add android
  ionic cordova build android --device
fi
