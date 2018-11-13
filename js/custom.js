function getCities() {
    $('#loader').fadeIn();
    $.ajax({
            url: "https://hotelinfoservice.sunwingtravelgroup.com/en/AllHotelDestinationList",
        })
        .done(function(data) {
            $('#loader').fadeOut();
            var template = '';
            var count = 0;
            data.forEach(function(e, root_i) {
                //console.log(e);
                //console.log('Counter: ', root_i % 4)
                if (root_i % 3 === 0)
                    template += '<div class="multi-column">';

                template += '<span class="country">' + e.countryName + '</span>';

                e.destinations.forEach(function(d, i) {
                    var link_name = d.toLowerCase();
                    template += '<span class="destination">';
                    template += '<a data-country="' + e.countryName + '" data-destination="' + link_name + '" class="destination-link" href="#">' + d + '</a>';
                    template += '</span>';
                });
                if (root_i % 3 === 2)
                    template += '</div>'
            });
            $('.multi-col-wrapper').append(template)
        })
        .fail(function() {
            $('#loader').fadeOut();
            console.log('something went wrong');
        });
}

getCities();

$("body").delegate(".destination-link", "click", function() {
    var country = $(this).data('country').toLowerCase();
    var destination = $(this).data('destination').toLowerCase();
    console.log(country, destination)
    $('#filter-content').html("");
    getExcursion(country, destination)
});

function getExcursion(country = null, destination = null) {
    $('#loader').fadeIn();
    var tabs_template = '';
    $.ajax({
            url: "https://hotelinfoservice.sunwingtravelgroup.com/1/en/excursionsCountryDestination/" + country + "/" + destination,
        })
        .done(function(data) {
            $('#loader').fadeOut();
            console.log(data);

            tabs_template += '<div id="tabs">';
            tabs_template += '<ul>';
            data.forEach(function(d, i) {
                tabs_template += '<li><a href="#tabs-' + i + '">' + d.categoryName + '</a></li>';
            });
            tabs_template += '</ul>';

            data.forEach(function(d, i) {
                tabs_template += `<div id="tabs-${i}"></div>`;
            });
            tabs_template += '</div>';
            $('#filter-content').append(tabs_template)

            //initialize tabs
            $(function() {
                $("#tabs").tabs();
            });

            //main filter categories start
            var allSubCats = [];
            var catIndex = ''
            data.forEach(function(d, i) {
                //console.log(d)
                var filter_temp = '<ul class="filter-tab-wrapper">';
                filter_temp += '<li data-filter="all"> All Excursions </li>';
                d.subCategories.forEach(function(e, ei) {
                    filter_temp += '<li data-filter="' + ei + '">' + e.subCategoryName + '</li>';
                });
                filter_temp += '</ul>';

                filter_temp += `<div class="filter-item filtr-container${i}">`
                d.subCategories.forEach(function(e, ei) {
                    filter_temp += setFilterTemplate(e, ei)
                });
                filter_temp += '</div>';

                $('#tabs-' + i).append(filter_temp)
                if (data.length - 1 === i)
                    initFilters(data)
            });

        })
        .fail(function() {
            $('#loader').fadeOut();
            console.log('something went wrong');
        });
}

function initFilters(data) {
    data.forEach(function(d, i) {
        $('.filtr-container' + i).filterizr({});
    });
}

function setFilterTemplate(subCat, si) {
    var filter_template = "";
    //var filter_template = `<div class="filter-item filtr-container${si}">`;
    subCat.excursions.forEach(function(d, i) {
        filter_template += `
            <div class="filtr-item" data-category="${i}" data-sort="value">
                <div class="heading-description">
                    <h5>${d.excursionName}</h5>
                    <p>${d.excursionFullName}</p>
                </div>
                <div class="exc-img"><img src="http:${d.excursionImages['Img4X3'][0]}" alt="excursion"></div>
                <p class="heading-content">${d.excursionShortDescription}</p>
                <span class="read-more">[<span class="cta">Read more</span>]</span>
            </div>`;
    });
    //filter_template += '</div>';
    return filter_template;
}