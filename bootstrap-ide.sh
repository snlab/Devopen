#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install -y  npm nodejs nodejs-legacy

# Initialize workspace
sudo -u vagrant mkdir workspace

# Setup c9sdk
sudo -u vagrant git clone https://github.com/c9/core c9sdk
cd c9sdk
cp /vagrant/client-workspace-maple.js configs/
cp /vagrant/maple-config.js configs/
cd plugins
sudo -u vagrant git clone https://github.com/snlab/c9.ide.maple
cd ..
HOME=/home/vagrant sudo -u vagrant scripts/install-sdk.sh

# Setup UI
cd ..
sudo -u vagrant cp -r /vagrant/TraceTreeDisplay ./
cd TraceTreeDisplay
npm install -g bower
HOME=/home/vagrant sudo -u vagrant make local

# Prepare script and binary
cd ../bin
sudo -u vagrant ln -s /home/vagrant/c9sdk/bin/c9 c9
sudo -u vagrant cp /vagrant/start_ide ./
sudo -u vagrant cp /vagrant/mininetSim ./
ln -s /home/vagrant/bin/mininetSim /usr/local/bin/mininetSim
sudo -u vagrant cp /vagrant/start_tt ./

# Prepare library
cd ../lib
sudo -u vagrant cp /vagrant/magellan-dataflow.jar ./
