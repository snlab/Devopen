#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install -y python-software-properties
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -y install openjdk-7-jre openjdk-7-jdk
sudo cp /vagrant/vagrantdeps/java-x86-64.conf /etc/ld.so.conf.d/
sudo ldconfig
sudo apt-get install -y libsqlite3-dev
sudo apt-get install -y ia32-libs
sudo apt-get install -y nodejs
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
sudo apt-get install -y git
git clone https://github.com/lmammino/cube-daemons.git && pushd cube-daemons && sudo ./install.sh && popd
sudo apt-get install -y ant
mkdir -p /home/vagrant/.maple
git clone https://github.com/snlab/APPrograms.git
cp -r APPrograms/lib /home/vagrant/.maple/
cp -r APPrograms/javadocs /home/vagrant/.maple/
cp -r /vagrant/src /home/vagrant/.maple/web
# the executable used to be inside APPrograms/lib, but was moved out and into this repository for safety
mkdir -p /home/vagrant/.maple/lib
cp -f /vagrant/vagrantdeps/maple /home/vagrant/.maple/lib/
sudo chown -R vagrant:vagrant /home/vagrant/.maple
sudo chown -R vagrant:vagrant /home/vagrant/cube-daemons
sudo chown -R vagrant:vagrant /home/vagrant/APPrograms
printf "\nPATH=/home/vagrant/.maple/lib:$PATH\n" >> /home/vagrant/.profile
npm install -g bower
