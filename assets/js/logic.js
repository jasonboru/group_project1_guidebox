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
      var query = guideboxEndpoint + searchTerm + '/fuzzy';
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
        console.log(streamData[i].display_name);
        $(".streamResults").append("<a target='_blank' href="+streamData[i].display_link
          +"><span>"+streamData[i].display_name+" </span>");
      }
  }




  function displaySearchData(data){
  var apisDefaultImg = 'https://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results) {
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
          console.log("___OMDB link for " + data.title+"___________")
          console.log(omdbEndpoint + data.imdb);
          console.log("___Guidebox link for " + data.title+"___________")
          console.log(trailerLinksURL);
          getDataFromOMDB(data.imdb);

          var rottenTomatoes = rottenTomEndpoint + data.rottentomatoes; 
          var commonSenseMedia = data.common_sense_media;
          var metaCritic = data.metacritic;
          var trailerVideo = data.trailers.web[0].embed;
          
          var watchLinks = data.purchase_web_sources[0].link;
          var description =
            "<div class='movieOverview hidden'>" +
              "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" 
                    + commonSenseMedia + " ><i class='fa fa-check-circle-o' aria-hidden='true'></i></a><br>" +"</h3>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>" +
              "<div class='movieLinks'>" +
                "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe'>"+
                "<i class='fa fa-youtube-play fa-2x' style='color:red;' aria-hidden='true'></i>" +
                "</a>" +
                "<a target='_blank' title='IMDB' href=" + imdbLink + "><img src='assets/images/imdb.png' height='25' width='25'></a>" +
                "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes 
                    +"><img src='assets/images/rotten.png' height='25' width='25'></a>" +
                "<a target='_blank'  title='Metacritic' href=" + metaCritic +"><img src='assets/images/Metacritic.png' height='25' width='25'></a>" +
              "</div>" +
              "<span class='movieText'>" + movieDescription + "</span><br>" +
              "<h5 class='watch'> Rent or Buy </h5>" + "<a target='_blank'  title='Rent/Buy' href=" + watchLinks 
                    +"><i class='fa fa-film fa-2x' style='color:white;' aria-hidden='true'></i></a>" + "<br>"  + 
              "<div class='streamResults'>" + "</div>"
            "</div>";  
            movieResult = "<div class='movieContainer'><img class='movieResult' src=" + image + ">" + description + "</div>";
          $('.guidebox-search-results').append(movieResult);
          streamingSources(data.subscription_web_sources);
          
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
      $(".landing").hide();
    });
  }

  $(document).on('click','#searchCall', function(){
    $(".landing").show();
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