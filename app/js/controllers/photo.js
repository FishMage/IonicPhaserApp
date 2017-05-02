(function() {
    'use strict';

    angular
        .module('App')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$scope', 'PhotoPlay', '$cordovaCamera', 'Modals', '$ionicLoading', '$timeout', '$cordovaSpinnerDialog'];
    function PhotoController($scope, PhotoPlay, $cordovaCamera, Modals, $ionicLoading, $timeout, $cordovaSpinnerDialog) {

        $scope.imageData = "img/camera.png";

        $scope.photo = {
            width: "100%",
            height: "100%",
            transparent: true,
            state: angular.copy(PhotoPlay.getState($scope))
        };

        $scope.photoTool = {
            options: []
        };

        $scope.takePhoto = function() {

            var options = {
                quality: 50,
                allowEdit: true,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            if (Camera) {
                options.destinationType = Camera.DestinationType.DATA_URL;
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.encodingType = Camera.EncodingType.JPEG;
            } else {
                $ionicLoading.hide();
                alert("You need test the camera in the device or emulator :)");
            }

            $cordovaCamera.getPicture(options).then(function(imageData) {
                try{
                    $cordovaSpinnerDialog.show(null, null, true);
                }
                catch(err){
                    $ionicLoading.show({
                        template: '<ion-spinner class="spinner-calm bigSpinner" icon="ripple"></ion-spinner>',
                        hideOnStateChange: true
                    });
                }
                //Fix to show the loading before to take the photo
                $timeout(function () {
                    getPhoto(imageData);
                }, 200);
                
                }, function(err) {
                // error
                //alert("Error with cordova camera, maybe you need install this plugin using the CLI :(");
            });
        };

        function getPhoto(imageData) {
            var newImg = document.getElementById("newImg");

            var img = new Image();
            img.src = "data:image/jpeg;base64," + imageData;
            img.onload = function() {

                var currentDimensions = {
                    width: img.width,
                    height: img.height
                }
                //Resize the big image using a canvas element! :)
                resizeImage(currentDimensions, 500, 500);
                newImg.width = currentDimensions.width;
                newImg.height = currentDimensions.height;
                var ctx = newImg.getContext("2d");
                ctx.drawImage(img, 0, 0, currentDimensions.width, currentDimensions.height);

                //Load the image
                $scope.photo.instance.state.getCurrentState().loadPhoto(newImg.toDataURL('image/png'));
            };
        }

        $scope.selectFilter = function(option) {
            $scope.photoTool.options.map(function(option) { option.selected = false; });
            option.selected = true;

            $scope.photo.instance.state.getCurrentState().selectFilter(option.imageData);
        };

        $scope.previewPhoto = function() {

            $scope.previewImage = $scope.photo.instance.state.getCurrentState().getImage();
            Modals.openModal($scope, 'templates/modals/previewImage.html', 'bounceInRight animated');
        };

        $scope.closeModal = function() {
            Modals.closeModal();
        };

        //Resize image with maxHeight or maxHeight
        function resizeImage(img, maxHeight, maxWidth) {
            var ratio = maxHeight / maxWidth;
            if (img.height / img.width > ratio) {
                // height is the problem
                if (img.height > maxHeight) {
                    img.width = Math.round(img.width * (maxHeight / img.height));
                    img.height = maxHeight;
                }
            } else {
                // width is the problem
                if (img.width > maxHeight) {
                    img.height = Math.round(img.height * (maxWidth / img.width));
                    img.width = maxWidth;
                }
            }
        }
    }
})();