#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  ionic cordova platform add ios --noresources --no-interactive --verbose
  cp GoogleService-Info.plist "platforms/ios/Deus LARP 2017/Resources/Resources"
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json --no-interactive --verbose
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  ionic cordova platform add android --noresources --no-interactive --verbose
  ionic cordova build android --device --no-interactive --verbose
fi
