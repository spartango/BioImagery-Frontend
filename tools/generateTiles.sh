#!/bin/sh

# Generates 256x256 tiles from images
# Depends on imagemagick

TILE_WIDTH=256
TILE_LENGTH=256

for image in `ls ../images`; do
     # Get the dimensions
     WIDTH=1024
     LENGTH=1024
     # Walk across x and y
     for (( xoffset = 0; xoffset <= WIDTH - TILE_WIDTH; xoffset+= TILE_WIDTH )); do
         for (( yoffset = 0; yoffset <= LENGTH - TILE_LENGTH; yoffset+= TILE_LENGTH )); do
            PARAMS="$TILE_WIDTH"x"$TILE_LENGTH+$xoffset+$yoffset"
            echo "Cropping $image with $PARAMS"
            convert "../images/$image" "+repage" -crop $PARAMS  "../tiles/$xoffset"_"$yoffset"_"$image"
         done
     done
done 