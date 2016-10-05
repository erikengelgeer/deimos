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
        //Users
        getUser: function (id) {
            return $http.get('api/user/' + id);
        },
        getUsers: function() {
            return $http.get('api/users');
        },
        getUsersByTeam: function(teamFk) {
            return $http.get('api/users/team/' + teamFk);  
        },

        //Shifts
        getShift: function (id) {
            return $http.get('api/shift.' + id);
        },
        getAllShifts: function () {
          return $http.get('api/shifts');
        },
        
        //Teams
        getTeams: function () {
          return $http.get('api/teams');  
        },


        //Weekly overview
        
    }
}