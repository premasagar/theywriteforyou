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
    var name = this.url.split('/').slice(-1)[0].replace('-', ' ')
    var url = this.url;
    var constituency = this.constituency;
    var party = this.party;
    $.each(this.pub_counts, function(paper, count) {
        if (!papers[paper]) {
            papers[paper] = {};
        }
        if (!papers[paper][party]) {
            papers[paper][party] = {'mps': {}, 'total': 0};
        }
        if (!papers[paper][party]['mps'][name]) {
            papers[paper][party]['mps'][name] = 0;
        }
        papers[paper][party]['mps'][name] += count;
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

$('.parties')
    .live('mouseover', function(ev){
        $('#newspaper-detail').show();
    });


function createNewspapers(papers) {
    $.each(papers, function(name, parties) {
        var li = $('<li></li>');
        $('.newspapers').append(li);
        var klass = name.toLowerCase().replace(/ /, '-');
        li.addClass(klass);
        $('<h2></h2>').text(name).appendTo(li);
        var ul = $('<ul class="parties"></ul>').appendTo(li);
        
        var total = 0;
        $.each(parties, function(party_name, obj) {
            total += obj.total;
        });
        
        $.each(parties, function(party_name, obj) {
            var klass = party_name.toLowerCase().replace(/ /, '-');
            var li = $('<li></li>').attr('title', party_name + ', ' + obj.total + ' article' + (obj.total == 1 ? '' : 's'));
            li.appendTo(ul);
            li.height((obj.total / total) * 200);
            li.addClass(klass);
            li.appendTo(ul);
        });
    });
}

createNewspapers(papers);
