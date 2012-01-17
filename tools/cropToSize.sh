#!/bin/sh

TARGET_WIDTH=1024
TARGET_HEIGHT=1024

for image in `ls ../rawimages/*.png`; do
     # Get the dimensions
     WIDTH=7296
     LENGTH=7200
     # Walk across x and y
     for (( xoffset = 0; xoffset < $WIDTH; xoffset+=$TARGET_WIDTH )); do
         for (( yoffset = 0; yoffset < $LENGTH; yoffset+= TARGET_HEIGHT )); do
            PARAMS="$TARGET_WIDTH"x"$TARGET_HEIGHT+$xoffset+$yoffset"
            echo "Cropping $image with $PARAMS"
            convert "../images/$image" -crop $PARAMS "../images/$xoffset"_"$yoffset"_"$image"
         done
     done
done 