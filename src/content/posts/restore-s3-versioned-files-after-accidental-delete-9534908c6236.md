---
title: "Restore S3 versioned files after accidental delete"
description: "Using jq proved handy when parsing Amazon AWS s3api JSON responses."
pubDatetime: 2015-12-08T12:00:00.000Z
tags: []
---

Using jq proved handy when parsing Amazon AWS s3api JSON responses.

[jq manual](https://stedolan.github.io/jq/manual/v1.5/)  
[jq cookbook](https://github.com/stedolan/jq/wiki/Cookbook)  
[jq FAQ](https://github.com/stedolan/jq/wiki/FAQ)

The magic command:

aws s3api list-object-versions --bucket BUCKETNAME --prefix some/path/in/bucket/ | jq --raw-output '.Versions | sort\_by(.LastModified) | .\[\] | select(.LastModified < "2015-12-08T00:00:00.000Z")| select(.IsLatest == false) | select(.Size>0) | select (.VersionId != "null") | "aws s3api get-object --bucket BUCKETNAME --version-id \\"" + .VersionId + "\\" --key \\"" + .Key + "\\" \\"" + .Key + "\\""' | sh

Explained:

- “--raw-output” turns off quotes of the outputted rows. Needed because we’re printign aws commands for each array element.
- Pick the Versions array
- Sort by the LastModified key
- Take array elements
- Sort them by LastModified so that we restore the versions by their order
- Only select versions before the accidental delete
- …and that are not the latest version (have been deleted)
- …and that have a size (are not deletes)
- …and that have a versionId
- for each remaining version of a file, print this command

This will download all versions of all such files. If a file has been replaced multiple times, the most recent version of that file will remain on the disk.

It is required that the paths have been pre-created with “mkdir -p” before executing this. This is because get-object doesn’t create subfolders when storing output files.
