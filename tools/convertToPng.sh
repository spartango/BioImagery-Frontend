#!/bin/sh

for image in `ls ../rawimages`; do
    echo "converting $image to ${image/%tif/png}"
    convert "../rawimages/$image" "../rawimages/${image/%tif/png}"
done 
