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
        timezones: {
            find: function () {
                return $http.get('api/timezones');
            }
        },
        users: {
            find: function () {
                return $http.get('api/users');
            },
            findOne: function (id) {
                return $http.get('api/users/' + id);
            },
            update: function (data) {
                return $http.put('api/users/update/', data);
            },
            updateRole: function (data) {
                return $http.put('api/users/update-role/', data);
            },
            add: function (data) {
                return $http.post('api/users/', data);
            },
            disable: function (id) {
                return $http.post('api/users/' + id);
            }
        },
        shiftType: {
            find: function () {
                return $http.get('api/shift-types');
            },
            findOne: function (id) {
                return $http.get('api/shift-types/' + id);
            },
            update: function (data) {
                return $http.put('api/shift-types/' + data.id, data)
            },
            add: function (data) {
                return $http.post('api/shift-types/', data);
            },
            disable: function (id) {
                return $http.post('api/shift-types/' + id);
            }
        },
        teams: {
            find: function () {
                return $http.get('api/teams/');
            },
            findOne: function (id) {
                return $http.get('api/teams/' + id);
            },
            update: function (data) {
                return $http.put('api/teams/' + data.id, data);
            },
            add: function (data) {
                return $http.post('api/teams/', data);
            },
            disable: function (id) {
                return $http.post('api/teams/' + id);
            }
        },
        roles: {
            find: function () {
                return $http.get('api/roles/');
            }
        },
        taskTypes: {
            find: function () {
                return $http.get('api/task-types');
            },
            findOne: function (id) {
                return $http.get('api/task-types/' + id)
            },
            update: function (data) {
                return $http.put('api/task-types/update', data)
            },
            add: function (data) {
                return $http.post('api/task-types/', data);
            },
            disable: function (id) {
                return $http.post('api/task-types/' + id);
            }
        },
        shifts: {
            find: function () {
                return $http.get('api/shifts/');
            },
            findByUser: function (userId) {
                return $http.get('api/shifts/user/' + userId)
            },
            findByUserAndDate: function (userId, date) {
                return $http.get('api/shifts/user/' + userId + '/' + date);
            },
            add: function (data) {
                return $http.post('api/shifts/', data);
            }
        },
        tasks: {
            find: function () {
                return $http.get('api/tasks/');
            },
            add: function (data) {
                return $http.post('api/tasks/', data);
            },
            delete: function (taskId) {
                return $http.delete('api/tasks/' + taskId);
            }
        }
    };
}