/**
 * Created by EAETV on 5/09/2016.
 */
angular.module('app').controller('PlanningController', PlanningController);

function PlanningController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

    $(function () {
        var selectedDates = [];
        var active_dates = [];

        $('.nav-tabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })

        $('.dropdown-toggle').dropdown();

        var startDate = new Date();

        var datepicker = $('#datetimepicker-1');
        datepicker.datepicker({
            multidate: true,
            todayHighlight: true,
            startDate: startDate
        });

        datepicker.on("changeDate", function (e) {
            var dates = datepicker.datepicker('getFormattedDate');

            if (dates != "") {
                selectedDates = dates.split(",");
            } else {
                selectedDates = [];
            }

            console.log(selectedDates);
        })

        // Plan Tasks
        var datepicker2 = $('#datetimepicker-2');
        datepicker2.datepicker({
            multidate: false,
            todayHighlight: true,
            startDate: startDate,
            beforeShowDay: function(date){
                var d = date;

                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                var formattedDate = day + "/" + month + "/" + year;

                console.log("days");

                if ($.inArray(formattedDate, active_dates) != -1){
                    return {
                        classes: 'shift'
                    };
                }
                return;
            }
        });
    })
};