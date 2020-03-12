const data = "https://crotel.me/data/";
const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
const request = new Request(`${data}`, {
			
            method: 'GET',
            headers: headers,
            credentials: 'include', // causes the browser to send cookies even for a cross-origin call
            redirect: 'follow'
            //mode: 'cors'
        });
fetch(request)
    .then(function (response) {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
    .then(function (json) {
        for (var i = 0; i < json.posts.length; i++) {
            var fgpList = document.querySelector('.timelines-container');
            var fgpListItem = document.createElement('div');
            fgpList.setAttribute("class", 'container ' + 'timelines-container');
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            }
            var publishTime = formatDate(json.posts[i].published_at);
            var plaintext = json.posts[i].plaintext.replace(/[\n\r]/g,'<br>');
                //plaintext.replace(/[\n\r]/g,'<br>');
            if ((i % 2) == 0) {
                fgpListItem.setAttribute("class", 'row ' + 'timeline-element ' + 'reverse ' + 'separline');
                fgpListItem.innerHTML = "<div class='timeline-date-panel col-xs-12 col-md-6 align-left'>" + "<div class='time-line-date-content'>" + "<p class='animated fadeInRight mbr-timeline-date mbr-fonts-style display-5'>" + publishTime + '<br>' + '</p>' + '</div>';
                fgpListItem.innerHTML += "<span class='iconBackground'>" + '</span>';
                fgpListItem.innerHTML += "<div class='col-xs-12 col-md-6 align-right animated fadeInLeft'>" + "<div class='timeline-text-content'>" + "<h4 class='mbr-timeline-title pb-3 mbr-fonts-style display-5'>" + json.posts[i].title + '<br>' + '</h4>' + "<p class='animated fadeIn mbr-timeline-text mbr-fonts-style display-7 align-left'>" + plaintext + '<br>' + '</p>' + '</div>' + '</div>';
                fgpList.appendChild(fgpListItem);
            } else {
                fgpListItem.setAttribute("class", 'row ' + 'timeline-element ' + 'separline');
                fgpListItem.innerHTML = "<div class='timeline-date-panel col-xs-12 col-md-6 align-right'>" + "<div class='time-line-date-content'>" + "<p class='animated fadeInRight mbr-timeline-date mbr-fonts-style display-5'>" + publishTime + '<br>' + '</p>' + '</div>';
                fgpListItem.innerHTML += "<span class='iconBackground'>" + '</span>';
                fgpListItem.innerHTML += "<div class='col-xs-12 col-md-6 align-left animated fadeInRight' style='padding-left: 5em;'>" + "<div class='timeline-text-content'>" + "<h4 class='mbr-timeline-title pb-3 mbr-fonts-style display-5'>" + json.posts[i].title + '<br>' + '</h4>' + "<p class='animated fadeIn mbr-timeline-text mbr-fonts-style display-7'>" + plaintext + '<br>' + '</p>' + '</div>' + '</div>';
                fgpList.appendChild(fgpListItem);

            }
        }
    })
    .catch(function (error) {
        var p = document.createElement('p');
        p.appendChild(
            document.createTextNode('Error: ' + error.message)
        );
        document.body.insertBefore(p, fgpList);
    });
