"use strict"

angular
    .module("postTest", [
        "ui.router",
        "ngResource"
    ])
    .config([
        "$stateProvider",
        RouterFunction
    ])
    .factory("PostFactory", [
        "$resource",
        PostFactoryFunction
    ])
    .factory("CommentFactory", function($resource) {
        return $resource("https://gamehub-rails-api.herokuapp.com/posts/:post_id/comments/:id", {}, {
            update: {
                method: "PUT"
            }
        })
    })
    .controller("PostIndexController", [
        "PostFactory",
        PostIndexControllerFunction
    ])
    .controller("PostNewController", [
        "PostFactory",
        "$state",
        PostNewControllerFunction
    ])
    .controller("PostShowController", [
        "PostFactory",
        "CommentFactory",
        "$stateParams",
        PostShowControllerFunction
    ])
    .controller("PostEditController", [
        "PostFactory",
        "$stateParams",
        "$state",
        PostEditControllerFunction
    ])
    .controller("CommentNewController", [
        "CommentFactory",
        "$stateParams",
        "$state",
        CommentNewControllerFunction
    ])
    .controller("CommentEditController", [
        "CommentFactory",
        "$stateParams",
        "$state",
        CommentEditControllerFunction
    ])


function RouterFunction($stateProvider) {
    $stateProvider
        .state("postIndex", {
            url: "/posts",
            templateUrl: "js/ng-views/index.html",
            controller: "PostIndexController",
            controllerAs: "vm"
        })
        .state("postNew", {
            url: "/posts/new",
            templateUrl: "js/ng-views/posts/new.html",
            controller: "PostNewController",
            controllerAs: "vm"
        })
        .state("postShow", {
            url: "/posts/:id",
            templateUrl: "js/ng-views/posts/show.html",
            controller: "PostShowController",
            controllerAs: "vm"
        })
        .state("postEdit", {
            url: "/posts/:id/edit",
            templateUrl: "js/ng-views/posts/edit.html",
            controller: "PostEditController",
            controllerAs: "vm"
        })
        .state("commentNew", {
            url: "/posts/:post_id/comment/new",
            templateUrl: "js/ng-views/comments/new.html",
            controller: "CommentNewController",
            controllerAs: "vm"
        })
        .state("commentEdit", {
            url: "/posts/:post_id/comments/:id/edit",
            templateUrl: "js/ng-views/comments/edit.html",
            controller: "CommentEditController",
            controllerAs: "vm"
        })
}

function PostFactoryFunction($resource) {
    return $resource("https://gamehub-rails-api.herokuapp.com/posts/:id", {}, {
        update: {
            method: "PUT"
        }
    })
}

function PostIndexControllerFunction(PostFactory) {
    this.posts = PostFactory.query()
}

function PostNewControllerFunction(PostFactory, $state) {
    this.post = new PostFactory()
    this.create = function() {
        this.post.$save(function(post) {
            $state.go("postShow", {
                id: post.id
            })
        })
    }
}


function CommentNewControllerFunction(PostFactory, CommentFactory, $stateParams) {
    this.comment = new CommentFactory()
    this.createComment = function() {
        this.comment.$save(function(comment) {
            CommentFactory.query({
                post_id: $stateParams.id
            })
        })
    }
}

function PostShowControllerFunction(PostFactory, CommentFactory, $stateParams) {
    this.post = PostFactory.get({
        id: $stateParams.id
    })
    this.comments = CommentFactory.query({
        post_id: $stateParams.id
    })
}


function PostEditControllerFunction(PostFactory, $stateParams, $state) {
    this.post = PostFactory.get({
        id: $stateParams.id
    })
    this.update = function() {
        this.post.$update({
            id: $stateParams.id
        }, function(post) {
            $state.go("postShow", {
                id: post.id
            })
        })
    }
    this.destroy = function() {
        this.post.$delete({
            id: $stateParams.id
        }, function(post) {
            $state.go("postIndex")
        })
    }
}

function CommentNewControllerFunction(CommentFactory, $stateParams, $state) {
    this.comment = new CommentFactory()
    this.create = function() {
        this.comment.post_id = $stateParams.post_id
        this.comment.$save({
                post_id: $stateParams.post_id
            },
            function(post) {
                $state.go("postShow", {
                    id: $stateParams.post_id
                })
            })
    }
}

function CommentEditControllerFunction(CommentFactory, $stateParams, $state) {
    this.comment = CommentFactory.get({
        post_id: $stateParams.post_id,
        id: $stateParams.id
    })
    this.update = function() {
        this.comment.$update({
                post_id: $stateParams.post_id,
                id: $stateParams.id
            },
            function(comment) {
                $state.go("postShow", {
                    id: comment.post_id
                })
            })
    }
    this.destroy = function() {
        this.comment.$delete({
            post_id: $stateParams.post_id,
            id: $stateParams.id
        }, function(comment) {
            $state.go("postShow", {
                id: $stateParams.post_id
            })
        })
    }
}
