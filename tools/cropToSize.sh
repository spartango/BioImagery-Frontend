#!/bin/sh

TARGET_WIDTH=1024
TARGET_HEIGHT=1024

for image in `ls ../rawimages/`; do
     # Get the dimensions
     WIDTH=7296
     LENGTH=7200
     # Walk across x and y
     for (( xoffset = 0; xoffset < WIDTH-TARGET_WIDTH; xoffset+= TARGET_WIDTH )); do
         for (( yoffset = 0; yoffset < LENGTH-TARGET_HEIGHT; yoffset+= TARGET_HEIGHT )); do
            TARGETFILE="../images/$xoffset"_"$yoffset"_"$image"
            if [[ ! -f  ]]; then
                PARAMS="$TARGET_WIDTH"x"$TARGET_HEIGHT+$xoffset+$yoffset"
                echo "Cropping $image with $PARAMS to ../images/$xoffset"_"$yoffset"_"$image"
                convert "../rawimages/$image" -crop $PARAMS $TARGETFILE
            fi
         done
     done
done 