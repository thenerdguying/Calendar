/**
     * Open datepicker
     */
    $('.redesign-datepicker-group input').on('focus', function(e){
        $('.datepicker').addClass('open');
    })

    $('.redesign-datepicker-group input').on('blur', function(e){
        e.preventDefault();
    })

    /**
     * Ok
     */

    $('.datepicker .btn-ok').on('click tap', function(){

     //which field is the datepicker for
     var dateFor = $(this).closest('.datepicker').attr('data-for');

     //select the field to be populated
     var dateInput = $('.redesign-datepicker-group[data-for="' + dateFor + '"]').find('input');
     //blur the input
     dateInput.blur();

     //populate date value
     var selectedDate = $('.date.selected').attr('data-date');
     dateInput.val(selectedDate);

     //close datepicker
     $(this).closest('.datepicker').removeClass('open');

     })

     /**
     * Toggle between year slider and calendar
     */
    $('.btn-select-year').on('click tap', function(){

        //toggle button states
        $(this).siblings('div').removeClass('active');
        $(this).addClass('active');

        //remove active class from all sections
        $('.datepicker .section').removeClass('active');

        //add active class to the year slider section
        $('.datepicker .section.year-slider').addClass('active');
    })

    $('.btn-date-label').on('click tap', function(){

        //toggle button states
        $(this).siblings('div').removeClass('active');
        $(this).addClass('active');

        //remove active class from all sections
        $('.datepicker .section').removeClass('active');

        //add active class to the year slider section
        $('.datepicker .section.calendar').addClass('active');
    })

    /**
     * Go to previous month
     */
    $('.btn-previous-month').on('click tap', function(){

        var prevMonth = $('.month.previous'),
            currMonth = $('.month.current'),
            nextMonth = $('.month.next');

        prevMonth.removeClass('previous').addClass('current');
        currMonth.removeClass('current').addClass('next');

        //TODO: Remove next month
        nextMonth.removeClass('next').addClass('previous');

        //TODO: Create new previous month
        var d = moment(nextMonth.find('.date[data-date]').first().attr('data-date'));
        generateMonth(d.subtract(3, 'month'), 'previous');

        //update label
        updateLabels();
    });

    /**
     * Go to next month
     */
    $('.btn-next-month').on('click tap', function(){
        var prevMonth = $('.month.previous'),
            currMonth = $('.month.current'),
            nextMonth = $('.month.next');


        currMonth.removeClass('current').addClass('previous');
        nextMonth.removeClass('next').addClass('current');

        //TODO: Remove previous month
        prevMonth.removeClass('previous').addClass('next')

        //TODO: Create new next month
        var d = moment(prevMonth.find('.date[data-date]').first().attr('data-date'));
        generateMonth(d.add(3, 'month'), 'next');

        //update label
        updateLabels();

    });

    /**
     * Select a date
     */

    $(document).on('click tap', '.date',function(){
        $('.date').removeClass('selected');
        $(this).addClass('selected');

        //update top date label
        var day = moment($(this).attr('data-date')).format('ddd'),
            monthAndDate = '<span class="no-wrap">' + moment($(this).attr('data-date')) .format('MMM D') + '<span>';
        $('.btn-date-label').html(day + ', ' + monthAndDate);
    })

    /**
     * Select year
     */

     $(document).on('click tap', '.year', function(){
         //select selected year in the list
         $('.year-slider .year').removeClass('active');
         $(this).addClass('active');

         //get year
         var yearEl = $(this);
         var year = $(this).attr('data-year');
         var yearSlider = $('.year-slider .years');

         //scroll to the position of the selected year
         yearSlider.animate({scrollTop: yearEl[0].offsetTop - $('.year-slider')[0].clientHeight}, 200 , 'swing', function() {

             //go back to the calendar
             $('.btn-select-year').removeClass('active');
             $('.btn-date-label').addClass('active');

             //remove active class from all sections
             $('.datepicker .section').removeClass('active');

             //add active class to the year slider section
             $('.datepicker .section.calendar').addClass('active');

         });

         //regenerate months
         //get the new date of the curent month
         var currentMonthDate = $('.current.month .date').not('.empty').first().attr('data-date');

         var newCurrentMonthDate = currentMonthDate.replace($('.current.month').attr('data-year'), year);

         //update calendar fields
         rengerateAllMonths(newCurrentMonthDate);

         //update labels
         updateLabels();



     })

    //Calendar initializer

    function initCalendar(){

        //Generate years
        populateYearSlider(moment().year());

        //Generate first three months
        //prev
        generateMonth(moment().subtract(1, 'month'),'previous');

        //current
        generateMonth(moment(),'current');

        //next
        generateMonth(moment().add(1, 'month'),'next');

        //select today's date in the calendar
        var todaysDate = moment().format('Y-DD-MM H:m:s');
        $('.date[data-date="' + todaysDate + '"]').addClass('selected');


    }

    /**
     *
     * @param thisYear e.g. 2016
     * Populates year slider section
     * Scrolls to the current year
     */
    function populateYearSlider(thisYear){

        //HTML templates
        var yearTemp = '<div data-year="{{year}}" class="year">{{year}}</div>';

        //remove years from calendar
        var years = $('.datepicker .year-slider .years');
        years.find('.year').remove();

        //generate 200 years in the past
        for(var i = 0; i<205; i++){
            var yearNumber = thisYear + 4 - i;
            var regExp = new RegExp('{{year}}', 'g');
            var year = yearTemp.replace(regExp, yearNumber);
            years.prepend(year);
        }

        //select this year as the active one
        var thisYearLabel = $('[data-year="' + thisYear +'"]');
        thisYearLabel.addClass('active');

        years.scrollTop(thisYearLabel.offset().top - 348);
    }

    /**
     *
     * @param date - just any date string
     */
    function rengerateAllMonths(date){
        //prev
        var prev = moment(date).subtract(1, 'month');
        generateMonth(prev,'previous');

        //current
        var curr = moment(date);
        generateMonth(curr,'current');

        //next
        var next = moment(date).add(1, 'month');
        generateMonth(next,'next');
    }


    /***
     *
     * @param d
     * @param whichMonth - previous, current, next
     */
    function generateMonth(d, whichMonth){

        var firstDay = d.set('date', 1).day(),
            daysInMonth = d.daysInMonth();


        firstDay = (firstDay == 0) ? 6 : firstDay - 1;



        var month = $('.month.' + whichMonth);

        //set year and month
        month.attr('data-year', d.format('Y'));
        month.attr('data-month', d.format('MMMM'));

        //update month and year label in the month controls
        if(whichMonth == 'current') {
            $('.month-year-label').text(d.format('MMMM') + ' ' + d.format('Y'));
        }


        //remove all dates from current month
        month.find('.date').remove();

        //insert empty days before the first of the month
        for(var i = 0; i<firstDay; i++){
            var date = '<div class="date empty"><span></span><div class="ripple"></div></div>';
            month.append(date);
        }

        //insert actual dates
        for(var i = 0; i<daysInMonth; i++){
        var dateTime = d.set('date', i + 1).format('Y-MM-DD');
        var date = '<div class="date" data-date="' + dateTime + '"><span>' + (i + 1) + '</span><div class="ripple"></div></div>';
        month.append(date);
    }
    }

    function updateLabels(){

        //month year label at the top of the calendar
        var currMonth = $('.month.current');
        var monthYear = currMonth.attr('data-month') + ' ' + currMonth.attr('data-year');
        $('.month-year-label').text(monthYear);

        //update year title
        var currYear = currMonth.attr('data-year');
        $('.btn-select-year').text(currYear);

        //select this year in the year slider
        $('.year-slider .year').removeClass('active');
        $('.year-slider .year[data-year="' + currYear + '"]').addClass('active');
    }


    initCalendar();