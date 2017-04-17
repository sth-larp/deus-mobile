#!/bin/bash
set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then  
  ionic platform add ios
  ionic build ios --device --buildConfig ./cordovaBuildConfig.json
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then  
  ionic platform add android
  ionic build android --device
fi