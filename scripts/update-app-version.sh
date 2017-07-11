VERSION=`git rev-list --count release`
sed -i -e "s/version=\"0\\.0\\.1\"/version=\"0.0.$VERSION\"/" config.xml
