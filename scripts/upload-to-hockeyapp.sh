changes=$(git log -1 --pretty=%B)
echo $changes
curl \
  -F "ipa=@platforms/ios/build/device/deus-larp-2017.ipa" \
  -F "notes=$changes" \
  -F "notes_type=0" \
  -F "status=2" \
  -H "X-HockeyAppToken: $HOCKEY_APP_TOKEN" \
  https://rink.hockeyapp.net/api/2/apps/upload
 
  
  
