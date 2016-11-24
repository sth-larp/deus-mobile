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

Detailed instruction is available at https://cordova.apache.org/docs/en/latest/guide/platforms/ios/.
Basic steps are:
 * Make sure you have XCode installed
 * Run xcode-select --install to install some XCode command-line tools.

## Windows

Basically same as Ubuntu, but Node.JS and JDK should be manually downloaded and installed.

# Set up Android app

Clone the repo:

    git clone https://github.com/sth-larp/deus-mobile.git
    cd deus-mobile

Install default packages:

    npm install

Make Cordova believe that we are in Cordova project.

    mkdir www

Add Android support:

    ionic platform add android

Copy google-services.json from Firebase Cloud Messaging web-console to platforms/android subfolder.

Attach your Android phone and make sure that USB debugging is enabled. Alternatively, you can use an emulator.

Launch the app in another console:

    ionic run android --device  # for emulator, replace "--device" with "--emulator"

To run application in browser (not all plugins are supported):
    
    ionic run browser