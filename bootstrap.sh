#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install -y git
if [ ! -d "/home/vagrant/mininet" ]; then
 sudo -u vagrant git clone git://github.com/mininet/mininet
fi
/home/vagrant/mininet/util/install.sh -a

# Update maven to latest
cd /home/vagrant/bin
sudo -u vagrant wget http://mirror.bit.edu.cn/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
sudo -u vagrant tar xvf apache-maven-3.3.9-bin.tar.gz
rm -rf apache-maven
sudo -u vagrant mv apache-maven-3.3.9 apache-maven
rm apache-maven-3.3.9-bin.tar.gz

# Setup OpenDaylight development environment
sudo -u vagrant mkdir -p /home/vagrant/.m2
pushd /home/vagrant/.m2
sudo -u vagrant mv -n ~/.m2/settings.xml{,.orig}
sudo -u vagrant wget https://raw.githubusercontent.com/opendaylight/odlparent/master/settings.xml
popd

