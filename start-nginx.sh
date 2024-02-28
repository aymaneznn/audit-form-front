#!/usr/bin/env bash
export EXISTING_VARS=$(printenv | grep -v ^_= | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in $JSFOLDER;
do
  tmpfile=$(mktemp)
  cp --attributes-only --preserve $file $tmpfile
  cat $file | envsubst $EXISTING_VARS > "$tmpfile" && mv $tmpfile $file
done
for file in $HTMLFOLDER;
do
  tmpfile=$(mktemp)
  cp --attributes-only --preserve $file $tmpfile
  cat $file | envsubst $EXISTING_VARS > "$tmpfile" && mv $tmpfile $file
done
nginx -g 'daemon off;'