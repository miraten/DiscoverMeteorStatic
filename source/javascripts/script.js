$(function(){

  lang = $('#lang').val();

  // browser console prompt
  $('span:contains("❯")').removeClass('err').addClass('browser-prompt');

  // sidebars
  $('.toc .toggle').click(function(event){
    console.log('aaa')
    event.preventDefault();
    $('body').toggleClass('toc-open sidebar-open')
  });
  $('.comments .toggle').click(function(event){
    event.preventDefault();
    $('body').toggleClass('comments-open sidebar-open')
  });

  $('.toc a').each(function(){
    if($(this).attr('href') == window.location.pathname)
      $(this).parent().addClass('active');
  });

  // pre
  $('pre').addClass('all-new');

  $('.lines-highlight').each(function(){
    var $this = $(this);
    var $pre = $this.prevAll('.highlight').first();
    var text = $pre.html();
    var lines = text.split('\n');    
    var linesToHighlight = $this.attr('data-lines');
    var highlightClass = $this.attr('data-class')
    var linesArray = linesToHighlight.split(',');
    var rangesArray = [];
    var finalArray = [];

    $pre.removeClass('all-new');

    // looping from the end makes it possible to splice from within the loop without reindexing problems
    //http://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
    var length = linesArray.length;
    while(length--){
      index = length;
      element = linesArray[index];
      if(typeof element === 'string'){
        var range = element.split('~');
        if(range.length > 1){
          var lowerBound = parseInt(range[0]);
          var upperBound = parseInt(range[1]);
          // initialize empty array for this range, and fill it
          rangeArray = [];
          for (var i = lowerBound; i <= upperBound; i++) {
            rangeArray.push(i);
          }
          // add range to array of ranges
          rangesArray.push(rangeArray);
          linesArray.splice(index,1);
        }else{
          linesArray[index] = parseInt(linesArray[index]);
        }
      }
    }

    // concat
    finalArray = linesArray.concat(rangesArray)
    // flatten and sort
    // http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
    finalArray= [].concat.apply([], finalArray);
    finalArray.sort(function(a,b){return a-b});


    // block level elements
    $.each(lines, function(index, line){
      if($.inArray(index+1, finalArray) == -1){
        lines[index] = '<span class="line">' + lines[index] + '</span>'
      }else{
        lines[index] = '<span class="line highlighted '+highlightClass+'">' + lines[index] + '</span>'
      }
    });
    $pre.html(lines.join(""));

  });

  // percentage translated

  if($('#progress').length){
    var totalParagraphs = $('#progress').attr('max');
    var findMarkers = $('.post-content').text().match(/\/\/\/\//g);
    var toTranslate = !!findMarkers ? findMarkers.length : 0;
    var translated = totalParagraphs - toTranslate;
    var percentageTranslated = (translated * 100 / totalParagraphs);
    $('.translation-progress progress').val(translated);
    $('.translation-progress p').attr('data-value', Math.round(percentageTranslated));
  }

});
