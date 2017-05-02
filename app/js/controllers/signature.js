(function() {
	'use strict';

	angular
		.module('App')
		.controller('SignatureController', SignatureController);

	SignatureController.$inject = ['$scope', 'SignaturePlay', 'Modals'];
	function SignatureController($scope,$state,$stateParams, SignaturePlay, Modals) {
    $scope.playerScores = [0, 0];

    $scope.startHome = function(){
      $state.go("home", {

      })
    }

    function getRandomOperator() {
      var operators = ["+", "-", "*", "/"];
      return operators[getRandomInt(0, 3)];
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomAnswer(previousRandomAnswers) {
      var minCoefficient = 0.5;
      var maxCoefficient = 2;
      var constant = getRandomInt(1, 9);
      constant *= ((getRandomInt(0, 1) == 0) ? -1 : 1);
      var randomAnswer = getRandomInt(minCoefficient * previousRandomAnswers[0] + constant, maxCoefficient * previousRandomAnswers[0] + constant);
      for (var i = 0; i < previousRandomAnswers.length; i++) {
        if (previousRandomAnswers[i] == randomAnswer) {
          return getRandomAnswer(previousRandomAnswers);
        }
      }
      return randomAnswer;
    }

    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }

    // +, - only for simplicity
    $scope.getRandomQuestion = function() {
      var numberOfAnswers = 4;
      var valueNum = getRandomInt(2, 4);
      var question = {
        "question" : "",
        "answers": [],
      };
      for (var i = 0; i < valueNum; i++) {
        var num = getRandomInt(1, 9);
        question.question += num + " ";
        if (i != valueNum - 1) {
          question.question += getRandomOperator() + " ";
        }
      }
      question.question = question.question.substring(0, question.question.length - 1);
      question.result = eval(question.question);
      for (var i = 0; i < numberOfAnswers; i++) {
        if (i == 0) question.answers.push(question.result);
        else {
          question.answers.push(getRandomAnswer(question.answers));
        }
      }
      $scope.question = question;
    }

    function resetScore() {
      $scope.playerScores = [0 , 0];
    }

    $scope.checkResult = function(user, response) {
      if (response.toFixed(0) == $scope.question.result.toFixed(0)) {
        $scope.playerScores[user]++;
      }
      else {
        $scope.playerScores[Math.abs(user-1)]++;
      }
      // Check win
      if ($scope.playerScores[0] == 4 || $scope.playerScores[1] == 4) {
        // DONT DO IT!
        alert("Player " + ($scope.playerScores[0] == 4 ? "Two " : "One ") + "SUCKS!");
        $state.go("home", {});
      }
      else {
        $scope.getRandomQuestion();
      }
    }
	}
})();
