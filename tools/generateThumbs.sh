#!/bin/sh

THUMB_WIDTH=330
THUMB_HEIGHT=334

for image in `ls ../images`; do
    PARAMS="$THUMB_WIDTH"x"$THUMB_HEIGHT"
    echo "Making thumb from $image to ${image/%tif/png}"
    convert "../images/$image" -resize $PARAMS "../thumbs/thumb_${image}"
done 
