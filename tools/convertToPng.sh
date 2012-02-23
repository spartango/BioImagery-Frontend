#!/bin/sh

for image in `ls ../rawimages`; do
    TARGETFILE="../rawimages/${image/%tif/png}"
    if [[ ! -f $TARGETFILE ]]; then
        echo "converting $image to ${image/%tif/png}"
        convert "../rawimages/$image" $TARGETFILE
    fi
done 
