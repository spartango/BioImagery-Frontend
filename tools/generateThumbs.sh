#!/bin/sh

THUMB_WIDTH=330
THUMB_HEIGHT=334
THROTTE_PERIOD=5
# Lock

if [[ -f ./.thumb_lock ]]; then
    echo "Thumbs already being generated...directory locked"
    exit 1
fi

touch ./.thumb_lock

for image in `ls ./images`; do
    TARGETFILE="./thumbs/thumb_${image}"
    if [[ ! -f $TARGETFILE ]]; then
        PARAMS="$THUMB_WIDTH"x"$THUMB_HEIGHT"
        echo "Making thumb from $image to ${image/%tif/png}"
        convert "./images/$image" -resize $PARAMS $TARGETFILE
    fi
done 

rm ./.thumb_lock