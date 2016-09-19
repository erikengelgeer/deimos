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
        users: {
            find: function() {
                return $http.get('api/users');
            },
            findOne: function (id) {
                return $http.get('api/users/' + id);
            }
        },
        shiftType: {
            find: function() {
                return $http.get('api/shift-types');
            },
            findOne: function (id) {
                return $http.get('api/shift-types/' + id);
            }
        },
        teams: {
            find: function () {
                return $http.get('api/teams/');
            },
            findOne: function (id) {
                return $http.get('api/teams/' + id);
            }
        },
        roles: {
            find: function () {
                return $http.get('api/roles/');
            }
        },
        taskTypes: {
            find: function () {
                return $http.get('api/task-type');
            },
            findOne: function (id) {
                return $http.get('api/task-type/' + id)
            }
        },
        shifts: {
            find: function () {
                return $http.get('api/shifts/');
            }
        },
        tasks: {
            find: function () {
                return $http.get('api/tasks/');
            }
        }

        //Shifts
        getShift: function (id) {
            return $http.get('api/shift.' + id);
        },


        //Weekly overview

    }
}