# Configure OS

## Ubuntu

### Ionic

Install NodeJS:

    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs

Install Cordova and Ionic:

    sudo npm install -g cordova
    sudo npm install -g ionic


### Android

Install JDK 1.8.

Check JDK version:

    javac --version

Make sure that JAVA_HOME is correct:

    echo $JAVA_HOME

Install Android SDK.

Add this to to your `~/.bashrc`:

    export ANDROID_HOME=<android SDK path>
    export PATH="${PATH}:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools"


### iOS

TODO



## Windows

TODO



# Set up Android app

Clone the repo:

    git clone https://github.com/sth-larp/deus-mobile.git
    cd deus-mobile

Install default packages:

    npm install

Init Ionic (TODO: is there a better way?):

    ionic serve

Kill Ionic server with `Ctrl+C`.

Install needed plugins:

    ionic plugin add cordova-plugin-nativestorage

Add Android support:

    ionic platform add android

Attach your Android phone and make sure that USB debugging is enabled. Alternatively, you can use an emulator.

Launch the app in another console:

    ionic run android --device  # for emulator, replace "--device" with "--emulator"

To run application in browser (not all plugins are supported):
    
    ionic run browser