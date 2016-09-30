// angular.module('app').factory('Api', Api);
//
// function Api($http) {
//     return {
//         login: function () {
//             return [];
//         },
//         users: {
//             find: function (id, username) {
//                 return $http.get('api/users/' + id);
//             },
//             findAll: function () {
//                 return $http.get('api/users/');
//             },
//             add: function (user) {
//                 return $http.post('api/users/');
//             },
//             update: {
//                 info: function () {
//                     return $http.post('api/users/update/info');
//                 },
//                 password: function () {
//                     return $http.post('api/users/update/password');
//                 }
//                 },
//                 delete: function (id) {
//                     return $http.post('api/users/delete' , id);
//                 },
//                 passwordRequest: function (email) {
//                     return $http.post('api/users/request-password' , email);
//                 }
//         }
//     }
// }

angular.module('app').factory('Api', Api);

function Api($http) {
    return {
        login: {
            check: function (username, password) {
                var data = '_username=' + username + '&_password=' + password;

                return $http({
                    url: 'api/login_check',
                    method: "POST",
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (response) {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

                    return response;
                })
            },
            checkRole: function (username) {
                return $http.post('api/users/user/check_role', username);
            }
        },
        users: {
            find: function (id) {
                return $http.get('api/users/', id);
            },
            findAll: function () {
                return $http.get('api/users/');
            },
            add: function (user) {
                return $http.post('api/users/');
            },
            update: {
                info: function () {
                    return $http.post('api/users/update/info');
                },
                password: function () {
                    return $http.post('api/users/update/password');
                }
            },
            delete: function (id) {
                return $http.post('api/users/delete' , id);
            },
            passwordRequest: function (email) {
                return $http.post('api/users/request-password' , email);
            }
        }
    }
}