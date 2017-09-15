/*global $*/
// initialize variables for interval of refreshing
var minutes = 120;
var milliseconds = min_to_ms(minutes);

// function that converts minutes to milliseconds for use in update_interval function
function min_to_ms(min){
    return min*60*1000;
}

// function that gets a json and updates the page 
function update_page() {
    // gets local json file
    /*global $*/
    /*global ODS_api*/
    // update meeting room info
    $.getJSON("https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=meeting-room-usage&rows=1000&sort=time&apikey=" + ODS_api + "&callback=?", function(meeting){
        // initialize a variable to display the title (today's date) at the top and list of usage data
        var usage_values = [];
        
        // loops through file and adds a row of data to the table after each iteration
        for (var i = 0; i < meeting.records.length; i++) {
            var record = meeting.records[i];
            // skip table data
            if(record.fields.status == "Approved" || record.fields.status == "Pending"){
                continue;
            // monthly popularity data
            }else if(record.fields.enddate == '%'){
                continue;
            // usage data
            }else{
                usage_values.push(Number(record.fields.time));
            }
        }
        
        // loops through meeting room id's and adds usage values
        for (var i = 0; i < usage_values.length; i++) {
            $('#m' + i).text(usage_values[i]);
        }
        
    });
    
    // update library card info
    $.getJSON("https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=patron-dashboard&rows=1&apikey=" + ODS_api + "&callback=?", function(exp_patron){
        var amount_exp = exp_patron.nhits;
        $.getJSON("https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=patrons&rows=1&apikey=" + ODS_api + "&callback=?", function(all_patrons){
            var amount_total = all_patrons.nhits;
            $('#l0').text(amount_exp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $('#l1').text((amount_exp/amount_total * 100).toFixed(2));
        });
    });
    
}

// function that calls update_page every specified minutes
function update_interval(interval) {
    var update = setInterval(update_page, interval);
}

// call update_page to get the initial values
update_page();

// call update_interval to display the data and start timer
update_interval(milliseconds);