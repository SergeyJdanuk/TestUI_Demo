#!/usr/bin/env bash

ROOT=$(pwd)
VERSION=$(git describe --tags)
DIR="release-${VERSION}"
ZIP_FILENAME="testui_android__${VERSION}.zip"

if [ -d $DIR ]; then
    rm -rf $DIR
fi

if [ -f $ZIP_FILENAME ]; then
    rm -f $ZIP_FILENAME
fi

mkdir $DIR

cp -r cache $DIR
cp -r css $DIR
cp -r dist $DIR
cp -r fonts $DIR
cp -r img $DIR
cp -r data $DIR
cp index.html ${DIR}/
mkdir $DIR/cgi-bin
cp cgi-bin/proxy.android.sh ${DIR}/cgi-bin/proxy.sh

cd $DIR
zip -r ${ROOT}/${ZIP_FILENAME} .
cd ..

if [ -d $DIR ]; then
    rm -rf $DIR
fi

echo "${ZIP_FILENAME}" > last_testui_archive_filename
echo "${ROOT}/${ZIP_FILENAME}" > last_testui_archive_filepath
echo "${VERSION}" > last_testui_version
