#!/bin/bash
set -e
sudo add-apt-repository ppa:openjdk-r/ppa -y
sudo apt-get -qq update
sudo apt-get install -y openjdk-8-jdk
sudo update-java-alternatives -s java-1.8.0-openjdk-amd64