var
    win = window,
    _ = win.console && win.console.firebug ? win.console.log : function(){},
    papers = {};

$.each(MP_DATA, function() {
    var
        mpName = this.url.split('/').slice(-1)[0].replace('-', ' '),
        url = this.url, // as yet unused
        constituency = this.constituency, // as yet unused
        party = this.party;
        
    $.each(this.pub_counts, function(paper, count) {
        if (!papers[paper]) {
            papers[paper] = {};
        }
        if (!papers[paper][party]) {
            papers[paper][party] = {'mps': {}, 'total': 0};
        }
        if (!papers[paper][party].mps[mpName]) {
            papers[paper][party].mps[mpName] = 0;
        }
        papers[paper][party].mps[mpName] += count;
        papers[paper][party].total += count;
    });
});

// ***

$(document)
    .bind('mousemove', function(ev){
        $('#newspaper-detail')
            .css({
                left:(ev.pageX + 8) + 'px',
                top:(ev.pageY - 8) + 'px'
            });
    });

$('.parties li')
    .live('mouseover', function(ev){
        var
            party = $(ev.currentTarget).attr('class'),
            partyName = (party.slice(0,1).toUpperCase() + party.slice(1)).replace('-', ' '),
            partyData = $(this).data('party'),
            mps = partyData.mps,
            html = '';
        
        html +=
            '<strong>' + partyName + '</strong> (' + partyData.total + ')' +
            '<ul>';
        
        $.each(mps, function(mp, articles){
            html += '<li>' + mp + ': ' + articles + '</li>';
        });
        
        html += '</ul>';
        
        $('#newspaper-detail')
            .attr('class', party)
            .html(html)
            .show();
    });
    
$('.newspapers > li')
    .live('mouseout', function(){
        $('#newspaper-detail')
            .hide();
    });


function createNewspapers(papers){
    $.each(papers, function(newspaperTitle, parties){
        var
            total = 0,
            partiesHtml = $('<ul class="parties"></ul>');
            
        $.each(parties, function(partyName, obj){
            total += obj.total;
        });
        
        $.each(parties, function(partyName, obj){
            partiesHtml.append(
                $('<li class="' +
                    partyName.toLowerCase().replace(/ /g, '-') + '">' +
                '</li>')
                    .data('party', obj)
                    .height((obj.total / total) * 200)
            );
        });
    
        $('<li class="' + newspaperTitle.toLowerCase().replace(/ /, '-') + '">' + 
            '<h2>' + newspaperTitle + ' (' + total + ')</h2>' +
        '</li>')
            .append(partiesHtml)
            .appendTo('.newspapers');
    });
}

createNewspapers(papers);
