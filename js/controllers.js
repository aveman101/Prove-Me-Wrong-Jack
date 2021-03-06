var proveItControllers = angular.module('ProveItControllers', ['ngSanitize']);




proveItControllers.controller('ProveItSearchController', function($scope) {

	window.$scope = $scope;

	if (localStorage['stealthMode']) {
		$scope.stealthMode = false || JSON.parse(localStorage['stealthMode']);
	} else {
		$scope.stealthMode = false;
	}

	$scope.toggleStealthMode = function() {
		$scope.stealthMode = !$scope.stealthMode;

		// Cache the result in localstorage.
		localStorage['stealthMode'] = JSON.stringify($scope.stealthMode);
	};

	



	$scope.templateURL;
	$scope.setTemplateURL = function(filename) {
		$scope.templateURL = "templates/"+filename;
	};
	$scope.setTemplateURL("blank.html");
	var knownTemplates = ["news1.html"];








	$scope.htmlSearchString = "";
	$scope.submitSearch = function(presetResult) {

		// Need to use setTimeout here, so the blur call is kicked outside of Angular's $apply.
		// If we don't do this, Angular will compain that we're manipulating the DOM directly within an $apply, which is a no-no.
		setTimeout(function() {angular.element("#stealthSearchField").blur()}, 0);

		$scope.setTemplateURL("news1.html");

		if (presetResult)
			$scope.searchInput = presetResult;

		// If the search term is empty, switch to the blank template...
		$scope.htmlSearchString = "";
		if (!$scope.searchInput || $scope.searchInput.length == 0) {
			$scope.setTemplateURL("blank.html");
			return false;
		}

		var unimportantWords = ["the", "for"];

		// Parse the search input string.
		// Split the query into words
		var searchWords = $scope.searchInput.split(" ");

		for (var i = searchWords.length - 1; i >= 0; i--) {

			// Short words (< 3 letters) should not be bold
			if (searchWords[i].length <= 2) {
				searchWords[i] = "</strong>"+searchWords[i]+"<strong>";
			}

			// The word "The" should not be bold
			if (_.contains(unimportantWords, searchWords[i].toLowerCase())) {
				searchWords[i] = "</strong>"+searchWords[i]+"<strong>";
			}
		};

		$scope.htmlSearchString = "<strong>"+searchWords.join(" ")+"</strong>";

		return false;
	};
});