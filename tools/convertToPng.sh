#!/bin/sh

for image in `ls ../rawimages`; do
    echo "converting $image to ${image/%tif/png}"
    convert "../rawimages/$image" "../images/${image/%tif/png}"
done 
