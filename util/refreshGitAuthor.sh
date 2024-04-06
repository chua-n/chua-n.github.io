#!/bin/bash

git filter-branch -f --env-filter '
old_name="chuan"
old_email="xucy-e@glodon.com"
new_name="chua-n"
new_email="chua_n@yeah.net"

if [ "$GIT_COMMITTER_NAME" = "$old_name" ] || [ "$GIT_COMMITTER_EMAIL" = "$old_email" ]
then
    export GIT_COMMITTER_NAME="$new_name"
    export GIT_COMMITTER_EMAIL="$new_email"
fi
if [ "$GIT_AUTHOR_NAME" = "$old_name" ] || [ "$GIT_AUTHOR_EMAIL" = "$old_email" ]
then
    export GIT_AUTHOR_NAME="$new_name"
    export GIT_AUTHOR_EMAIL="$new_email"
fi
' --tag-name-filter cat -- --branches --tags
