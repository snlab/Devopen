##Maple GUI

- [Installation](#installation)
  - [Haskell Controller](#running-the-web-ui-using-the-bundled-maplehaskell-controller)
  - [ODL](#running-the-web-client-on-odlmaple-work-in-progress)
- [Contributing](#contributing)
- [Wiki](https://github.com/snlab/MapleGUI/wiki)

##Installation

###Running the Web UI using the bundled MapleHaskell controller

1. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [vagrant](https://www.vagrantup.com/downloads.html) and set up [Mininet VM](http://mininet.org/download/) (option 1: VM is generally the easiest approach). 

2. Clone this repository and set up a Vagrant instance:

    ```bash
    git clone git@github.com:snlab/MapleGUI.git
    cd MapleGUI
    vagrant up
    ```
    
3. SSH into the Vagrant instance and set up AP-Programs

    ```bash
    vagrant ssh
    cd /vagrant/
    make install
    cd /home/vagrant/APPrograms
    ant
    ```

to build maple and then

    maple -u classes SP

this will start the Maple Haskell controller and load the shortest path AP. 

While the Maple Haskell controller is running, bring up a Mininet VM or ssh into it (``ssh mininet@[ip-for-mininet-vm]``, password: ``mininet``), start a virtual network with 1 switch and 5 hosts (or any topology you like):

    sudo mn --controller=remote,ip=[maple vm ip] --mac --topo=tree,depth=1,fanout=5

Now open up a browser and go to localhost:3000 to view the web UI. 

###Running the web client on ODL/Maple (Work in progress)

_Note: most of the GUI do not work on ODL at the moment_

####Prerequisites 

Install OpenDaylight, ODLMaple, and MapleCore.

Install nodejs and bower. After you've installed nodejs, you can use npm to install bower:

    npm install -g bower

Make sure ODLMaple is running (you see "Maple Initialized" in the ODL console), and install the odl-restconf feature (so our local server can access the ODL datastore using restconf).

Run `make local` under MapleGUI/, then

    cd dist
    node server.js
    
Now open up a browser and go to localhost:3000 to view the web UI. 

##Contributing

We need your help! See our wiki page for notes on [basic architecture](https://github.com/snlab/MapleGUI/wiki/Web-GUI-architecture), and our [issues](https://github.com/snlab/MapleGUI/issues) for opportunities to engage with us and improve the codebase.
