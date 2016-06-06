#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install -y  npm nodejs nodejs-legacy

sudo -u vagrant mkdir workspace

sudo -u vagrant git clone https://github.com/c9/core c9sdk
cd c9sdk
cp /vagrant/client-workspace-maple.js configs/
cp /vagrant/maple-config.js configs/
cd plugins
sudo -u vagrant git clone https://github.com/snlab/c9.ide.maple
cd ..
HOME=/home/vagrant sudo -u vagrant scripts/install-sdk.sh

cd ../bin
sudo -u vagrant ln -s /home/vagrant/c9sdk/bin/c9 c9
sudo -u vagrant cp /vagrant/start_ide ./
sudo -u vagrant cp /vagrant/mininetSim ./
ln -s /home/vagrant/bin/mininetSim /usr/local/bin/mininetSim

cd ../lib
sudo -u vagrant cp /vagrant/magellan-dataflow.jar ./
