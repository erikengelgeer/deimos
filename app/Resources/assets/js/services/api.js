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
            findOne: function (id) {
                return $http.get('api/users/' + id);
            },
            findByTeam: function (teamId) {
                return $http.get('api/users/team/' + teamId);
            },
            findLoggedIn: function () {
                return $http.get('api/users/user');
            },
            findAll: function () {
                return $http.get('api/users/');
            },
            add: function (user) {
                return $http.post('api/users/', user);
            },
            update: {
                info: function () {
                    // Unused?
                    return $http.post('api/users/update/info');
                },
                password: function (password) {
                    return $http.post('api/users/update/password', password);
                },
                update: function (data) {
                    return $http.put('api/users/update/', data);
                },
            },
            disable: function (id) {
                return $http.post('api/users/' + id);
            },
            passwordRequest: function (email) {
                return $http.post('api/users/request-password', email);
            },
            findByToken: function (token) {
                return $http.post('api/users/token', token)
            },
            passwordReset: function (data) {
                return $http.post('api/users/reset-password', data);
            },
            updateRole: function (data) {
                return $http.put('api/users/update-role/', data);
            }
        },
        timezones: {
            find: function () {
                return $http.get('api/timezones');
            }
        },
        shiftType: {
            find: function () {
                return $http.get('api/shift-types');
            },
            findOne: function (id) {
                return $http.get('api/shift-types/single/' + id);
            },
            update: function (data) {
                return $http.put('api/shift-types/' + data.id, data)
            },
            add: function (data) {
                return $http.post('api/shift-types/', data);
            },
            disable: function (id) {
                return $http.post('api/shift-types/' + id);
            },
            findByTeam: function (team) {
                return $http.get('api/shift-types/'+ team);
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
            findByTeam: function (team, startDate, weeks) {
                return $http.get('api/shifts/' + team + '?startDate=' + startDate + '&weeks=' + weeks);
            },
            add: function (data) {
                return $http.post('api/shifts/', data);
            },
            update: function (data) {
                return $http.put('api/shifts/' + data.id, data);
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
            },
            update: function (data) {
                return $http.put('api/tasks/' + data.id, data);
            }
        }
    }
}


// //Users
// getUser: function (id) {
//     return $http.get('api/user/' + id);
// },
// getUsers: function() {
//     return $http.get('api/users');
// },
// getUsersByTeam: function(teamFk) {
//     return $http.get('api/users/team/' + teamFk);
// },
//
// //Shifts
// getShift: function (id) {
//     return $http.get('api/shift.' + id);
// },
// getAllShifts: function (team) {
//     return $http.get('api/shifts/' + team);
// },
//
// //Teams
// getTeams: function () {
//     return $http.get('api/teams/');
// },
