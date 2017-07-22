#!/bin/bash
set -e

changes=$(git log -1 --pretty=%B)

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  file_to_upload="platforms/ios/build/device/Deus LARP 2017.ipa"
fi

if [[ "$TRAVIS_OS_NAME" != "osx" ]]; then
  file_to_upload="platforms/android/build/outputs/apk/android-debug.apk"
fi

curl \
  -F "ipa=@$file_to_upload" \
  -F "notes=$changes" \
  -F "notes_type=0" \
  -F "status=2" \
  -F "release_type=0" \
  -H "X-HockeyAppToken: $HOCKEY_APP_TOKEN" \
  https://rink.hockeyapp.net/api/2/apps/upload



