$(document).ready(function() {
  var omdbEndpoint = "https://www.omdbapi.com/?i=";
  var guideboxApiKey = '5de31aceff0f33007097cdd38a781d9ce2c97579';
  var guideboxEndpoint = 'https://api-public.guidebox.com/v1.43/us/' + guideboxApiKey + '/search/movie/title/';
  var quota = $.getJSON('https://api-public.guidebox.com/v1.43/us/' + guideboxApiKey + '/quota', function(data){
    console.log(data);
  });
  var imdbEndpoint = "https://www.imdb.com/title/";
  var rottenTomEndpoint = "https://www.rottentomatoes.com/m/";
  //display popular movies by default on main page
  //search any movie title

  function searchGuideboxAPI(searchTerm, callback) {
      var query = guideboxEndpoint + searchTerm /*+ '/fuzzy'*/;
      $.getJSON(query, callback)
  };
  //grab ratings from OMDB api call
  function getDataFromOMDB(imdbLink) {
    var search = omdbEndpoint + imdbLink;
    $.getJSON(search, function(omdb){
      imdb_rating = omdb.imdbRating;
      var meta_rating = omdb.Metascore;
    });
  };

  function streamingSources(streamData) {
      for(i=0; i<streamData.length; i++) {
        //console.log(streamData[i].display_name);
        $(".streamResults").append("<a target='_blank' href="+streamData[i].link
          +"><span class='streamLink'>"+streamData[i].display_name+"</span></a>");
      }
  }

    function showCast(cast) {
      for(i=0; i<6; i++) {
       
        $(".castResults").append("<span class='castMem'>"+cast[i].name+"</span>");
      }
  }

  function rentBuySources(purchase) {
      for(i=0; i<purchase.length; i++) {
        //console.log(streamData[i].display_name);
        
        $(".buyResults").append("<a target='_blank' href="+purchase[i].link
          +"><span class='streamLink'>"+purchase[i].display_name+"</span></a>");
      }
  }

  function displaySearchData(data){
  var apisDefaultImg = 'https://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results) {
    console.log(data.results);
    $(".landing").fadeOut("slow");
    data.results.forEach(function(item) {
      var image = item.poster_240x342;
      if (image != apisDefaultImg) {
        //get movie details if image exists from api
        var trailerLinksURL = 'https://api-public.guidebox.com/v1.43/US/' + guideboxApiKey + '/movie/' + item.id;
        //grab individual elements from movies to display in dom
        $.getJSON(trailerLinksURL, function(data){
          var movieResult = '';
          var rated = data.rating;
          var genre = data.genres[0].title;
          var movieDescription = data.overview;
          var imdbLink = imdbEndpoint + data.imdb;

          //console.log("___OMDB link for " + data.title+"___________")
          //console.log(omdbEndpoint + data.imdb);
          //console.log("___Guidebox link for " + data.title+"___________")
          //console.log(trailerLinksURL);

          getDataFromOMDB(data.imdb);

          //streamingSources(data.subscription_web_sources);
          //showCast(data.cast);

          var rottenTomatoes = rottenTomEndpoint + data.rottentomatoes; 
          var commonSenseMedia = data.common_sense_media;
          var metaCritic = data.metacritic;
          var trailerVideo = data.trailers.web[0].embed;          
          var watchLinks = data.purchase_web_sources[0].link;


          var descHead = "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" 
                    + commonSenseMedia + " ><i class='fa fa-check-circle-o' aria-hidden='true'></i></a><br>" +"</h3>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>"

          var descLinks = "<div class='movieLinks'>" +
                "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe'>"+
                "<i class='movieLinkIcon fa fa-youtube-play fa-2x' style='color:red;' aria-hidden='true'></i>" +
                "</a>" +
                "<a target='_blank' title='IMDB' href=" + imdbLink + "><img class='movieLinkIcon' src='assets/images/imdb.png' height='25' width='25'></a>" +
                "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes 
                    +"><img class='movieLinkIcon' src='assets/images/rotten.png' height='25' width='25'></a>" +
                "<a target='_blank'  title='Metacritic' href=" + metaCritic +"><img class='movieLinkIcon' src='assets/images/Metacritic.png' height='25' width='25'></a>" +
              "</div>"

          var descbody = "<div class='castResults'></div>" +
              "<span class='movieText'>" + movieDescription + "</span><br>"

          var descViews = "<h5 class='watch'> Rent or Buy </h5><div class='buyResults'></div>" + "<br>" +
                        "<h5 class='watch'> Streaming On </h5><div class='streamResults'></div>"

          var description =
              "<div class='movieOverview hidden'" +"'>" + descHead + descLinks + descbody
                    + descViews + "</div>";

            movieResult = "<div class='movieContainer valign-wrapper'><img data-ref="+data.id+" class='movieResult z-depth-5' src=" + image + ">" + description + "</div>";
          $('.guidebox-search-results').append(movieResult);
          
          
        });
      }
    });
  } else {
    noResults += '<p>Sorry we could not find anything with that title. <p>';
    ('.guidebox-search-results').append(noResults);
    }
  };
  //wait for a submit click
  function runOnSubmit(){
    $('.guidebox-search-form').submit(function(event){
      $('.guidebox-search-results').empty();
      event.preventDefault();
      var query = $(this).find('.guidebox-query').val();
      searchGuideboxAPI(query, displaySearchData);
      
    });
  }

  $(document).on('click','#searchCall', function(){
    $('.guidebox-search-results').empty();
    $(".landing").fadeIn("slow");
  });


  $(function(){    
    runOnSubmit();
  });

  $(document).on('click','.movieResult', function(){
    $(this).addClass("active");
    $(this).parent().find('.movieOverview').removeClass('hidden');
    $(this).parent().find('.movieOverview').hide();
    $('.movieResult').hide();
    $('.active').show();
    $(this).animate({
          left: '30px'
      }, 1000);
    $(this).parent().find('.movieOverview').show(1000);
    var cardURL = 'https://api-public.guidebox.com/v1.43/US/' + guideboxApiKey + '/movie/' + $(this).data("ref");
    $.getJSON(cardURL, function(data){
      $(".streamResults").empty();
      $(".castResults").empty();
      streamingSources(data.subscription_web_sources);
      showCast(data.cast);
      rentBuySources(data.purchase_web_sources);
    });



  });

  $(document).on('click', '.active', function(){
    $(this).removeClass('active');
    $('.movieResult').show();
    $('.movieOverview').addClass('hidden');
  });

  //wait for a submit click
  function watchSubmit(){
    $('.guidebox-search-form').submit(function(event){
      $('.guidebox-search-results').empty();
      event.preventDefault();
      var query = $(this).find('.guidebox-query').val();
      getSearchDataFromApi(query, displaySearchData);
      
    });
  }



});