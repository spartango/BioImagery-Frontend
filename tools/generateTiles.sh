#!/bin/sh

# Generates 256x256 tiles from images
# Depends on imagemagick

TILE_WIDTH=256
TILE_LENGTH=256

THROTTLE_PERIOD=5

# Lock
if [[ -f ./.tile_lock ]]; then
    echo "Tiles already being generated...directory locked"
    exit 1
fi

touch ./.tile_lock

for image in `ls ./images`; do
     # Get the dimensions
     WIDTH=1024
     LENGTH=1024
     # Walk across x and y
     for (( xoffset = 0; xoffset <= WIDTH - TILE_WIDTH; xoffset+= TILE_WIDTH )); do
         for (( yoffset = 0; yoffset <= LENGTH - TILE_LENGTH; yoffset+= TILE_LENGTH )); do
            TARGETFILE="./tiles/$xoffset"_"$yoffset"_"$image"
            if [[ ! -f $TARGETFILE ]]; then
                PARAMS="$TILE_WIDTH"x"$TILE_LENGTH+$xoffset+$yoffset"
                echo "Cropping $image with $PARAMS"
                convert "./images/$image" "+repage" -crop $PARAMS $TARGETFILE
            fi

         done
     done
done 

rm ./.tile_lock