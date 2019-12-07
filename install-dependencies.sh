#!/bin/bash

rm -r node_modules
rm package-lock.json

npm install

# ./node_modules/.bin/node-pre-gyp install --directory=./node_modules/grpc --target_platform=darwin --target_arch=x64 --target=12.12.0 --target_libc=unknown
./node_modules/.bin/node-pre-gyp reinstall --directory=./node_modules/grpc --target_platform=linux --target_arch=x64 --target=12.13.0 --target_libc=glibc