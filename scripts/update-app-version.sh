#!/bin/bash

# Try to extract latest version tag from the current branch.
tag_and_revision=`git describe --tags --first-parent --candidates=1 --match=v* 2> /dev/null`

if [ $? -eq 0 ]; then
  # If there is at least one version tag, use it for two major version components.
  if [[ $tag_and_revision =~ ^v([0-9]+\.[0-9]+)$ ]]; then
    # If HEAD is exactly on the tag, git prints only the tag name.
    tag_version="${BASH_REMATCH[1]}"
    num_commits="0"
  elif [[ $tag_and_revision =~ ^v([0-9]+\.[0-9]+)-([0-9]+)-g([0-9a-f]+)$ ]]; then
    # If HEAD is after the tag, git prints the number of commits since the tag (how handy!)
    # and current commit hash (we don't need the later).
    tag_version="${BASH_REMATCH[1]}"
    num_commits="${BASH_REMATCH[2]}"
  else
    echo "Bad tag_and_revision: ${tag_and_revision}. Version tags must follow pattern vXXX.YYY" >&2
    exit 1
  fi
else
  # If there are no version tags, get the number of commits since the Big Bang.
  tag_version="0.0"
  num_commits=`git rev-list --count HEAD`
fi

version="${tag_version}.${num_commits}"
sed -i -r -e "s/version=\"[0-9]+\\.[0-9]+\\.[0-9]+\"/version=\"${version}\"/" config.xml
sed -i -r -e "s/ios-CFBundleVersion=\"[0-9]+\\.[0-9]+\\.[0-9]+\"/ios-CFBundleVersion=\"${version}\"/" config.xml
