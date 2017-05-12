#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then  
  ionic cordova platform add ios
  ionic cordova build ios --device --buildConfig ./cordovaBuildConfig.json
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then  
  ionic cordova platform add android
  ionic cordova build android --device
fi
