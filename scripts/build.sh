#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  ionic cordova platform add ios --noresources --no-interactive
  cp GoogleService-Info.plist "platforms/ios/Deus LARP 2017/Resources/Resources"
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json --no-interactive
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  ionic cordova platform add android --noresources --no-interactive
  ionic cordova build android --device --no-interactive
fi
