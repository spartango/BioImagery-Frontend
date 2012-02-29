#!/bin/sh

for image in `ls ../rawimages`; do
    TARGETFILE="../rawimages/${image/%tif/png}"
    if [[ ! -f $TARGETFILE ]]; then
        echo "converting $image to ${image/%tif/png}"
        convert "../rawimages/$image" $TARGETFILE
        rm "../rawimages/$image"
    fi
done 
