#!/bin/bash

export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_31.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
cd android
./gradlew clean assembleRelease


./gradlew --stop
