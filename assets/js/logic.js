$(document).ready(function() {
  var omdbEndpoint = "https://www.omdbapi.com/?i=";
  var guideboxApiKey = '5de31aceff0f33007097cdd38a781d9ce2c97579'; //back up key bb5916942e7197cb1bbd1ba21afebb7bb1b57a51
  var guideboxEndpoint = 'https://api-public.guidebox.com/v1.43/us/' + guideboxApiKey + '/search/movie/title/';
  var quota = $.getJSON('https://api-public.guidebox.com/v1.43/us/' + guideboxApiKey + '/quota', function(data){
    console.log(data);
  });
  var imdbEndpoint = "https://www.imdb.com/title/";
  var rottenTomEndpoint = "https://www.rottentomatoes.com/m/";
  var facebookEndpoint = "https://www.facebook.com/";
  var wikipediaEndpoint = "https://en.wikipedia.org/?curid=";
  //display popular movies by default on main page
  //search any movie title

  $("#logoSmall").hide();

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
    if (streamData.length){

      for(i=0; i<streamData.length; i++) {
        //console.log(streamData[i].display_name);
        $(".streamResults").append("<a target='_blank' href="+streamData[i].link
          +"><span class='streamLink'>"+streamData[i].display_name+"</span></a>");
      }
    } else {
        $(".streamResults").append("none avaialable");
    }
  }

  function showCast(cast) {
    for(i=0; i<8; i++) {
      $(".castResults").append("<span class='castMem'>"+cast[i].name+"</span>");
    }
  }

  function castingCall(person) {
    
  }

  function rentBuySources(purchase) {
    for(i=0; i<6; i++) {
      //console.log(streamData[i].display_name);
      $(".buyResults").append("<a target='_blank' href="+purchase[i].link
          +"><span class='streamLink'>"+purchase[i].display_name+"</span></a>");
    }
  }

  function displaySearchData(data){
  var apisDefaultImg = 'http://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results.length) {
    //console.log("data results: "+data.results);
    $(".landing").hide();
    $("#logoSmall").fadeIn("slow");
    data.results.forEach(function(item) {
      var image = item.poster_240x342;
      console.log("item", item, "image", image, "apis", apisDefaultImg);
      if (image !== apisDefaultImg) {
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
          console.log("___Guidebox link for " + data.title+"___________")
          console.log(trailerLinksURL);

          getDataFromOMDB(data.imdb);

          var rottenTomatoes = rottenTomEndpoint + data.rottentomatoes; 
          var commonSenseMedia = data.common_sense_media;
          var metaCritic = data.metacritic;
          var trailerVideo = data.trailers.web[0].embed;          
          var watchLinks = data.purchase_web_sources[0].link;
          var facebook = facebookEndpoint + data.social.facebook.facebook_id;
          var wikipedia = wikipediaEndpoint + data.wikipedia_id;


          var descHead = "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" 
                    + commonSenseMedia + " ><i class='fa fa-check-circle-o' aria-hidden='true'></i></a><br>" +"</h3>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>"

          var descLinks = "<div class='movieLinks'>" +
                "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe' id='trailerLink'>" +
                "<img class='movieLinkIcon' src='assets/images/trailer.png' height='25' width='25'></a>" +
                "<a target='_blank' title='IMDB' href=" + imdbLink + "><img class='movieLinkIcon' src='assets/images/imdb.png' height='25' width='25'></a>" +
                "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes 
                    +"><img class='movieLinkIcon' src='assets/images/rotten.png' height='25' width='25'></a>" +
                "<a target='_blank'  title='Metacritic'  href=" + metaCritic +"><img class='movieLinkIcon' src='assets/images/Metacritic.png' height='25' width='25'></a>" +
                "<a target='_blank' title='Facebook' href=" + facebook + "><img class='movieLinkIcon' src='assets/images/facebook.png' height='25' width='25'></a>" +
                "<a target='_blank' title='Wikipedia' href=" + wikipedia + "><img class='movieLinkIcon' src='assets/images/wikipedia.png' height='25' width='25'></a>" + "</div>"

          var descbody = "<div class='castResults'></div>" +
              "<span class='movieText'>" + movieDescription + "</span><br>"

          var descViews = "<h5 class='watch'> Rent or Buy </h5><div class='buyResults'></div>" + "<br>" +
                        "<h5 class='watch'> Subscription Services </h5><div class='streamResults'></div>"

          var description =
              "<div class='movieOverview z-depth-5 hidden'" +"'>" + descHead + descLinks + descbody
                    + descViews + "</div>";

            movieResult = "<div class='movieContainer valign-wrapper'><img data-ref="+data.id+" class='movieResult z-depth-5' src=" + image + ">" + description + "</div>";
          $('.guidebox-search-results').append(movieResult);
          
          
        });
      }
    });
  } else {
    var noResults = '<p><i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i>Sorry, we could not find anything with that term. <br>Please type a new term.</p>';
    $('.guidebox-search-results').append(noResults);
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
    $("#logoSmall").hide();
    $(".landing").fadeIn("slow");
  });


  $(function(){    
    runOnSubmit();
  });

  $(function() {
    $("#form").validate({
      rules: {
        titleTerm: {
          required: true
        } 
      },
      messages: {
        required: 'please enter a search term'
      },
      errorElement : 'div',
      errorLabelContainer: '.errorTxt'
    });
  });

  $(document).on('click','.movieResult', function(){
    $(this).addClass("active");
    $(this).parent().find('.movieOverview').removeClass('hidden');
    $(this).parent().find('.movieOverview').hide();
    $('.movieResult').hide();
    $('.active').show();
    $(this).animate({
          left: '130px'
      }, 1000);
    $(this).parent().find('.movieOverview').show(1000);
    var cardURL = 'https://api-public.guidebox.com/v1.43/US/' + guideboxApiKey + '/movie/' + $(this).data("ref");
    $.getJSON(cardURL, function(data){
      $(".streamResults").empty();
      $(".castResults").empty();
      $(".buyResults").empty();
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