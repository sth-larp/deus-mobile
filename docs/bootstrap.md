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

## Unit-test and lint infrastructure

Install Karma:

    sudo npm install -g karma-cli tslint

# Setup

Clone the repo:

    git clone https://github.com/sth-larp/deus-mobile.git
    cd deus-mobile

Install needed packages:

    npm install

## Set up browser emulation

First, build the plugins (only once):

    ionic cordova build browser

To run application in browser with auto-reload on changes (not all plugins are supported):

    npm start

and open [http://localhost:8100/](http://localhost:8100/).

For mobile emulation (iPhone + Android) run

    npm start -- --lab

and open [http://localhost:8100/ionic-lab](http://localhost:8100/ionic-lab).

## Set up Android app

Add Android support:

    ionic cordova platform add android

Attach your Android phone and make sure that USB debugging is enabled. Alternatively, you can use an emulator.

Launch the app in another console:

    ionic cordova run android --device  # for emulator, replace "--device" with "--emulator"

## Set up iOS app

NB: NOT TESTED

Add iOS support:

    ionic cordova platform add ios

Start app:

    ionic cordova run ios --device  # for emulator, replace "--device" with "--emulator"

