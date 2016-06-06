'use strict';

/* App Module */

var mapleApp = angular.module('mapleApp', [
    'ngRoute',
    'ui.bootstrap',
    'mapleControllers', 'ui.sortable', 'xeditable'
]);

mapleApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'login.html',
        }).
        when('/topology', {
            templateUrl: 'topology.html',
            controller: 'topoCtrl'
        }).
        when('/ports', {
            templateUrl: 'ports.html',
            controller: 'PortCtrl'
        }).
        when('/fib', {
            templateUrl: 'fib.html',
            controller: 'fibCtrl'
        }).
        when('/hostLocs', {
            templateUrl: 'hostLocs.html',
            controller: 'hostLocsCtrl'
        }).
        when('/links', {
            templateUrl: 'links.html',
            controller: 'linksCtrl'
        }).
        when('/services', {
            templateUrl: 'services.html',
            controller: 'ServiceController'
        }).
        when('/servicePolicy', {
            templateUrl: 'servicePolicy.html',
            controller: 'ServicePolicyController'
        }).
        when('/usage', {
            templateUrl: 'usage.html',
            controller: 'usageCtrl'
        }).
        when('/badhosts', {
            templateUrl: 'badhosts.html',
            controller: 'BadHostsCtrl'
        }).
        when('/acl', {
            templateUrl: 'acl.html',
            controller: 'AclCtrl'
        }).
        when('/monitor', {
            templateUrl: 'monitor.html',
            controller: 'MonitorCtrl'
        }).
        when('/taps', {
            templateUrl: 'taps.html',
            controller: 'TapCtrl'
        }).
        when('/onboarding', {
            templateUrl: 'onboarding.html',
            controller: 'OnboardCtrl'
        }).
        when('/onboarddevice/:deviceId', {
            templateUrl: 'onboarddevice.html',
            controller: 'OnboardDeviceCtrl'
        }).
        when('/collaboration', {
            templateUrl: 'collaboration.html',
            controller: 'CollabCtrl'
        }).
        when('/addDevice', {
            templateUrl: 'adddevice.html',
            controller: 'AddDeviceCtrl'
        }).
        when('/tt', {
            templateUrl: 'tracetree.html',
            controller: 'TTCtrl'
        }).
        when('/test', {
            templateUrl: 'test.html',
            controller: 'TestCtrl'
        }).
        otherwise({
            redirectTo: '/tt'
        });
    }
]);

mapleApp.run(function($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (current != null) {
            if (current.originalPath == "/usage" && next.originalPath != "/usage") {
                stopUsagePlots();
            } else if (current.originalPath == "/topology" && next.originalPath != "/topology") {
                Topology.deinit();
            } else if (current.originalPath == "/tt" && next.originalPath != "/tt") {
                current.scope.clearPeriodicUpdates();
            }
        }
    });
});

/* Controllers */

var mapleControllers = angular.module('mapleControllers', []);

mapleControllers.controller(
    'HeaderCtrl', ['$scope',
        '$location',
        function($scope, $location) {
            $scope.isActive = function(viewLocation) {
                return viewLocation === $location.path();
            };
        }
    ]);

mapleControllers.controller(
    'ServiceController', ['$scope', '$http', function($scope, $http) {
        var req = {
            component: "appServices",
            method: "read"
        };

        $scope.endpoints = [];

        $http.get('/hostlocations').success(function(data) {
            $scope.endpoints = _.sortBy(data, 'host').map(function(h) {
                return {
                    value: h.host,
                    text: prettyPrintMac(h.host)
                };
            });
            $scope.endpoints2 = $scope.endpoints.slice(0);
            $scope.endpoints2.splice(0, 0, {
                value: null,
                text: ""
            });
        });

        $http.post("/db", req).success(function(data) {
            $scope.services = data;
        });

        $scope.removeService = function(d) {
            $scope.services = _.without($scope.services, d);
            var req = {
                component: "appServices",
                method: "write",
                value: $scope.services
            };
            $http.post("/db", req).success(function() {});
        };

        $scope.saveService = function(data) {
            var req = {
                component: "appServices",
                method: "write",
                value: $scope.services
            };
            $http.post("/db", req).success(function() {});
        };

        $scope.addService = function() {
            $scope.inserted = {
                app: 0,
                endpoint1: 0,
                endpoint2: 0,
                bandwidth: 0,
                waypoint: null
            };
            $scope.services.push($scope.inserted);
        };
    }]
);

mapleControllers.controller(
    'ServicePolicyController', ['$scope', '$http', function($scope, $http) {
        var req = {
            component: "appRanking",
            method: "read"
        };

        $scope.apps = [];

        $http.post("/db", req).success(function(data) {
            $scope.apps = data;
        });

        $scope.removeService = function(d) {
            // alert(JSON.stringify($scope.services[index]));
            $scope.apps = _.without($scope.apps, d);
            //$scope.apps.splice(index,1);
            var req = {
                component: "appRanking",
                method: "write",
                value: $scope.apps
            };
            $http.post("/db", req).success(function() {});
        };

        $scope.saveService = function(data) {
            // alert(JSON.stringify(data));
            // alert(JSON.stringify($scope.services));
            var req = {
                component: "appRanking",
                method: "write",
                value: $scope.apps
            };
            $http.post("/db", req).success(function() {});
        };

        $scope.addService = function() {
            $scope.inserted = {
                rank: 0,
                app: 0
            };
            $scope.apps.push($scope.inserted);
        };
    }]
);

mapleControllers.controller(
    'PortCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            var prettifyPort = function(r) {
                r.prettySwitch = prettyPrintMac(r.switch);
                return r;
            }
            $http.get('/ports').success(function(data) {
                $scope.switchPorts = data.map(prettifyPort);
            });
            var handleCallback = function(msg) {
                $scope.$apply(function() {
                    $http.get('/ports').success(function(data) {
                        $scope.switchPorts = data.map(prettifyPort);
                    });
                });
            };
            var source = new EventSource('/event');
            source.addEventListener('message', handleCallback, false);
        }
    ]);

mapleControllers.controller(
    'usageCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            startUsagePlots();
        }
    ]);
mapleControllers.controller(
    'topoCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            Topology.init();
            Topology.installView(new TopologyFDGView(Topology.Model));
            Topology.periodicallyUpdate();
        }
    ]);

mapleControllers.controller('fibCtrl', ['$scope', '$http',
    function($scope, $http) {
        var prettifyActions = function(r) {
            r.switchLabel = r.switchAddr + " (" + r.switchName + ")";
            // format match
            {
                var matchPrettyStr = "";
                Object.keys(r.match).forEach(function(k) {
                    switch (k) {
                        case "ethernet-match":
                            if (r.match[k]["ethernet-source"]) {
                                matchPrettyStr += ("ethSrc: " + r.match[k]["ethernet-source"].address + ", ");
                            }
                            if (r.match[k]["ethernet-destination"]) {
                                matchPrettyStr += ("ethDst: " + r.match[k]["ethernet-destination"].address + ", ");
                            }
                            if (r.match[k]["ethernet-type"]) {
                                matchPrettyStr += ("ethType: " + r.match[k]["ethernet-type"].type + ", ");
                            }
                            break;
                        default:
                            matchPrettyStr += (k + ":" + r.match[k] + ",");
                            break;
                    }
                });
                r.match = matchPrettyStr.slice(0, -2); // chop off final two characters ", "
            }
            // format action
            {
                var actionPrettyStr = "";
                r.actions.forEach(function(action) {
                    if (action["apply-actions"].action) {
                        action["apply-actions"].action.forEach(function(aa) {
                            Object.keys(aa).forEach(function(k) {
                                switch (k) {
                                    case "order":
                                        // ignore me
                                        break;
                                    case "output-action":
                                        if (aa[k]["output-node-connector"]) {
                                            actionPrettyStr += "toNodeConnector: " + aa[k]["output-node-connector"] + ", ";
                                        }
                                        break;
                                    default:
                                        actionPrettyStr += (k + ":" + aa[k] + ", ");
                                        break;
                                }
                            });
                            r.actions = actionPrettyStr.slice(0, -2); // chop off final two characters ", "
                        });
                    }
                });
            }
            return r;
        };

        $http.get('/fib').success(function(data) {
            $scope.frules = data.map(prettifyActions);
        });

        var handleCallback = function(msg) {
            $scope.$apply(function() {
                $http.get('/fib').success(function(data) {
                    $scope.frules = data.map(prettifyActions);
                });
            });
        };
        var source = new EventSource('/event');
        source.addEventListener('message', handleCallback, false);
    }
]);

mapleControllers.controller(
    'CollabCtrl', ['$scope',
        '$http',
        '$location',
        function($scope, $http, $location) {
            $scope.lab = {
                name: "Physics"
            }

            $scope.devices = [{
                    deviceId: 3,
                    prettyMac: prettyPrintMac(3),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Andreas Voellmy",
                    deviceType: "Campus, Whitelist",
                    collabsText: "None"
                }

                , {
                    deviceId: 4,
                    prettyMac: prettyPrintMac(4),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Y. Richard Yang",
                    deviceType: "Science, Physics",
                    collabsText: (prettyPrintMac(2) + " (A. Voellmy in BioChem)")
                }
            ];

            $scope.addDevice = function() {
                $location.path("/addDevice");
            };
        }
    ]);

mapleControllers.controller(
    'AddDeviceCtrl', ['$scope',
        '$http',
        '$routeParams',
        '$location',
        function($scope, $http, $routeParams, $location) {

            $scope.device = {
                deviceId: 3,
                prettyMac: prettyPrintMac(3),
                os: "OS X 10.10",
                model: "MacBook Pro",
                owner: "Andreas Voellmy",
                deviceType: "Campus, Whitelist",
                collabsText: "None"
            };

            $scope.save = function() {
                $location.path("/collaboration");
            };
        }
    ]);

mapleControllers.controller(
    'OnboardCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            $scope.devices = [{
                    deviceId: 1,
                    prettyMac: prettyPrintMac(1),
                    os: "Windows 7",
                    model: "Dell",
                    owner: "Y. Richard Yang",
                    deviceType: "Pending Request"
                }

                , {
                    deviceId: 2,
                    prettyMac: prettyPrintMac(2),
                    os: "Ubuntu 12.04 LTS",
                    model: "HP",
                    owner: "Andreas Voellmy",
                    deviceType: "Campus"
                }

                , {
                    deviceId: 3,
                    prettyMac: prettyPrintMac(3),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Andreas Voellmy",
                    deviceType: "Campus, Whitelist"
                }

                , {
                    deviceId: 4,
                    prettyMac: prettyPrintMac(4),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Y. Richard Yang",
                    deviceType: "Science, Physics"
                }

                , {
                    deviceId: 5,
                    prettyMac: prettyPrintMac(5),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Andreas Voellmy",
                    deviceType: "Science, Physics"
                }

                , {
                    deviceId: 6,
                    prettyMac: prettyPrintMac(6),
                    os: "OS X 10.10",
                    model: "MacBook Pro",
                    owner: "Y. Richard Yang",
                    deviceType: "Science, BioChem"
                }
            ];
        }
    ]);

mapleControllers.controller(
    'OnboardDeviceCtrl', ['$scope',
        '$http',
        '$routeParams',
        '$location',
        function($scope, $http, $routeParams, $location) {

            $scope.device = {
                deviceId: 3,
                prettyMac: prettyPrintMac(3),
                os: "OS X 10.10",
                model: "MacBook Pro",
                owner: "Andreas Voellmy",
                deviceType: "Campus, Whitelist"
            }


            $scope.save = function() {
                $location.path("/onboarding");
            };
        }
    ]);

mapleControllers.controller(
    'hostLocsCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            $http.get('/hostlocations').success(function(data) {
                $scope.hostlocs = data.map(function(h) {
                    return {
                        host: h.host,
                        switch: h.switch,
                        port: h.port,
                        prettyHost: prettyPrintMac(h.host),
                        prettySwitch: prettyPrintMac(h.switch)
                    };
                });
            });
            var handleCallback = function(msg) {
                $scope.$apply(function() {
                    $http.get('/hostlocations').success(function(data) {
                        $scope.hostlocs = data.map(function(h) {
                            return {
                                host: h.host,
                                switch: h.switch,
                                port: h.port,
                                prettyHost: prettyPrintMac(h.host),
                                prettySwitch: prettyPrintMac(h.switch)
                            };
                        });
                    });
                });
            };
            var source = new EventSource('/event');
            source.addEventListener('message', handleCallback, false);
        }
    ]);

mapleControllers.controller(
    'linksCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            $http.get('/topology').success(function(data) {
                $scope.links = data.links.map(function(h) {
                    return {
                        source: prettyPrintMac(h.source),
                        sourceport: h.sourceport,
                        target: prettyPrintMac(h.target),
                        targetport: h.targetport
                    };
                });
            });
            var handleCallback = function(msg) {
                $scope.$apply(function() {
                    $http.get('/topology').success(function(data) {
                        $scope.links = data.links.map(function(h) {
                            return {
                                source: prettyPrintMac(h.source),
                                sourceport: h.sourceport,
                                target: prettyPrintMac(h.target),
                                targetport: h.targetport
                            };
                        });
                    });
                });
            };
            var source = new EventSource('/event');
            source.addEventListener('message', handleCallback, false);
        }
    ]);

mapleControllers.controller(
    'usageCtrl', ['$scope',
        '$http',
        function($scope, $http) {
            startUsagePlots();
        }
    ]);
