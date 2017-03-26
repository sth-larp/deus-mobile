# Prerequisites

## NodeJS

### Ubuntu

Install NodeJS:

    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs

### Windows

Install NodeJS manually.

## JDK and Android SDK

This step can be skipped if not building for Android.

Install JDK 1.8.

Check JDK version:

    javac --version

Make sure that JAVA_HOME is correct:

    echo $JAVA_HOME

Install Android SDK.

Add this to to your `~/.bashrc`:

    export ANDROID_HOME=<android SDK path>
    export PATH="${PATH}:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools"

## XCode

This step can be skipped if not building for iOS.

Detailed instruction is available at https://cordova.apache.org/docs/en/latest/guide/platforms/ios/.
Basic steps are:
 * Make sure you have XCode installed
 * Run xcode-select --install to install some XCode command-line tools.

## Ionic

Install Cordova and Ionic:

    sudo npm install -g cordova
    sudo npm install -g ionic

## Unit-test infrastructure

Install Karma:

    sudo npm install -g karma-cli

# Setup

Clone the repo:

    git clone https://github.com/sth-larp/deus-mobile.git
    cd deus-mobile

Install needed packages:

    npm install

Make Cordova believe that we are in Cordova project.

    mkdir www

## Set up browser emulation

To run application in browser with auto-reload on changes (not all plugins are supported):
    
    ionic serve

## Set up Android app

Add Android support:

    ionic platform add android

Attach your Android phone and make sure that USB debugging is enabled. Alternatively, you can use an emulator.

Launch the app in another console:

    ionic run android --device  # for emulator, replace "--device" with "--emulator"

## Set up iOS app

NB: NOT TESTED

Add iOS support:

    ionic platform add ios

Start app:

    ionic run ios --device  # for emulator, replace "--device" with "--emulator"

