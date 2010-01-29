// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var
    cache = {}
    _ = console && console.log ? console.log : function(){};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();


var papers = {};
$.each(MP_DATA, function() {
    var
        mpName = this.url.split('/').slice(-1)[0].replace('-', ' '),
        url = this.url,
        constituency = this.constituency,
        party = this.party;
        
    $.each(this.pub_counts, function(paper, count) {
        if (!papers[paper]) {
            papers[paper] = {};
        }
        if (!papers[paper][party]) {
            papers[paper][party] = {'mps': {}, 'total': 0};
        }
        if (!papers[paper][party]['mps'][mpName]) {
            papers[paper][party]['mps'][mpName] = 0;
        }
        papers[paper][party]['mps'][mpName] += count;
        papers[paper][party]['total'] += count;
    });
});

// ***
        
    $(document).one('click', function(){
        $('#newspaper-detail')
            .hide();
    });


var detail = $(tmpl('newspaper', {}))
    .hide()
    .appendTo('body');

$(document)
    .bind('mousemove', function(ev){
        detail
            .css({
                left:ev.pageX,
                top:ev.pageY
            });
    });

$('.parties li')
    .live('mouseover', function(ev){
        var
            party = $(ev.currentTarget).attr('class'),
            partyName = (party.slice(0,1).toUpperCase() + party.slice(1)).replace('-', ' '),
            partyData = $(this).data('party'),
            mps = partyData.mps,
            html = '<strong>' + partyName + '</strong> (' + partyData.total + ')<ul>';
        
        $.each(mps, function(mp, articles){
            html +=
                '<li>' + mp + ': ' + articles + '</li>';
        });
        
        $('#newspaper-detail')
            .attr('class', party)
            .html(html + '</ul>')
            .show();
    });


function createNewspapers(papers){
    $.each(papers, function(newspaper, parties){
        // Parallel processing
        window.setTimeout(function(){
            var li = $('<li></li>');
            $('.newspapers').append(li);
            var klass = newspaper.toLowerCase().replace(/ /, '-');
            li.addClass(klass);
            var ul = $('<ul class="parties"></ul>').appendTo(li);
            
            var total = 0;
            $.each(parties, function(party_name, obj) {
                total += obj.total;
            });
            $('<h2></h2>').text(newspaper + ' (' + total + ')').appendTo(li);
            
            $.each(parties, function(party_name, obj) {
                var klass = party_name.toLowerCase().replace(/ /g, '-');
                var li = $('<li></li>');
                li.appendTo(ul);
                li.data('party', obj);
                li.height((obj.total / total) * 200);
                li.addClass(klass);
                li.appendTo(ul);
            });
        },0);
    });
}

createNewspapers(papers);
