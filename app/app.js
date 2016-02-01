var appModule = angular.module('soundBoard', ['ngAudio']);

appModule.controller('MainCtrl', ['$scope', '$http', 'ngAudio', function($scope, $http, ngAudio) {
    $scope.sounds = [];
    $scope.clicksRemaining = Math.pow(2, 32);
    $scope.lastPlayed = '';
    $scope.playing = null;
    $scope.audio = null;

    $scope.overlay = false;

    $scope.$watch('playing.obj.progress', function(newValue, oldValue) {
        $scope.overlay = newValue < 1.0;
    });

    $http.get('app/sounds.json').then(function(result) {
        $scope.sounds = result.data;
        angular.forEach($scope.sounds, function(s) {
            s.obj = ngAudio.load(s.url);
            s.played = 0;
            s.name = s.name.replace(/_/g, ' ');
        });
        $scope.sounds.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

    });

    $scope.playSound = function(i) {
        if($scope.playing && $scope.playing.obj.remaining > 0.0) {
            return;
        }
        $scope.playing = $scope.sounds[i];
        var obj = $scope.playing.obj;
        $scope.playing.played++;

        console.log($scope.playing);
        obj.play();

        $scope.lastPlayed = obj.remaining;

        $scope.clicksRemaining--;
    };

    $scope.update = function() {

    }

    $scope.cancelSound = function() {
    }
}]);
