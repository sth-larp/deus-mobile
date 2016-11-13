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

Add Android support:

    ionic platform add android

Install hot-code-push plugin (see [plugin documentation](https://github.com/nordnet/cordova-hot-code-push/wiki/Quick-start-guide-for-Ionic-project) for details)

    ionic plugin add cordova-hot-code-push-plugin
    ionic plugin add cordova-hot-code-push-local-dev-addon
    npm install cordova-hot-code-push-cli  # plugin doc suggests to add "-g", but I didn't manage to make it work
    cordova-hcp server

As a result you should see something like:

    Running server
    Checking:  /Cordova/TestProject/www
    local_url http://localhost:31284
    Warning: .chcpignore does not exist.
    Build 2015.09.02-10.17.48 created in /Cordova/TestProject/www
    cordova-hcp local server available at: http://localhost:31284
    cordova-hcp public server available at: https://5027caf9.ngrok.com

Attach your Android phone and make sure that USB debugging is enabled. Alternatively, you can use an emulator.

Launch the app in another console:

    ionic run android --device  # for emulator, replace "--device" with "--emulator"
