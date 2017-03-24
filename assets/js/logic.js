$(document).ready(function() {
  var omdbEndpoint = "https://www.omdbapi.com/?i=";
  var guideboxApiKey = '5de31aceff0f33007097cdd38a781d9ce2c97579'; //back up key bb5916942e7197cb1bbd1ba21afebb7bb1b57a51
  var guideboxEndpoint = 'http://api-public.guidebox.com/v2/us/' + guideboxApiKey + '/search/movie/title/';
  var quota = $.getJSON('http://api-public.guidebox.com/v2/us/' + guideboxApiKey + '/quota', function(data){
    console.log(data);
  });
  var imdbEndpoint = "https://www.imdb.com/title/";
  var rottenTomEndpoint = "https://www.rottentomatoes.com/m/";
  var facebookEndpoint = "https://www.facebook.com/";
  var wikipediaEndpoint = "https://en.wikipedia.org/?curid=";
  //display popular movies by default on main page

  var nytMovieKey = "20ef8a21506e4a07854339d77f1c8ac2";
  var nytMovieEndpoint = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
  //search any movie title

  $("#logoSmall").hide();
    

  function searchGuideboxAPI(searchTerm, callback) {
      var query = guideboxEndpoint + searchTerm /*+ '/fuzzy'*/;
      $.getJSON(query, callback);
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
          +"><button class='streamLink btn waves-effect waves-light'>"+streamData[i].display_name+"</button></a>");
      }
    } else {
        $(".streamResults").append("none avaialable");
    }
  }

  function showCast(cast) {
    for(i=0; i<15; i++) {
      $(".castResults").append("<button class='castMem btn waves-effect waves-light submit' data-castID='" + cast[i].id + "'>"+cast[i].name+"</button>");
    }
  }

  function castingCall(personID, callback) {
    var castQuery = 'http://api-public.guidebox.com/v2/person/' + personID + '/credits?api_key=' + guideboxApiKey + '&role=cast';
    console.log("castQuery is " + castQuery)
      $.getJSON(castQuery, callback);
  };

  $(document).on('click','.castMem', function(){
    $('.guidebox-search-results').empty();
    var castData = $(this).attr('data-castID');
    console.log("castID is " + castData)
      castingCall(castData, displaySearchData);
    });

  function rentBuySources(purchase) {
    if (purchase.length){
      for(i=0; i<6; i++) {
      console.log("where to buy"+purchase[i].display_name);
        $(".buyResults").append("<a target='_blank' href="+purchase[i].link
          +"><button class='streamLink btn waves-effect waves-light'>"+purchase[i].display_name+"</button></a>");
      }
    } else {
        $(".buyResults").append("none avaialable");
    }
  }

  //document.addEventListener("DOMNodeInserted", function(event) {
  //    $('ul.tabs').tabs();
  //});

  function displaySearchData(data){
  var apisDefaultImg = 'http://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results.length) {
    //console.log("data results: "+data.results);
    $(".landing").hide();
    $("#logoSmall").fadeIn("slow");
    data.results.forEach(function(item) {
      var image = item.poster_240x342;
      //console.log("item", item, "image", image, "apis", apisDefaultImg);
      if (image !== apisDefaultImg) {
        //get movie details if image exists from api
        var trailerLinksURL = 'http://api-public.guidebox.com/v2/US/' + guideboxApiKey + '/movie/' + item.id;
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


          var descHead = "<div id='descHead' class='col s12'>" + "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" 
                    + commonSenseMedia + " ><img src='assets/images/commonsense.png' height='40' width='40'></a><br>" +"</h3>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>" +
              "<p class='movieText'>" + movieDescription + "</p><br>" + "</div>" 

          var descLinks = "<div id='descLinks' class='movieLinks col s12'>" +
              "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe' id='trailerLink'>" +
              "<img class='movieLinkIcon' src='assets/images/play_trailer.png' height='100' width='100'></a>" +
              "<a target='_blank' title='IMDB' href=" + imdbLink + "><img class='movieLinkIcon' src='assets/images/imdb.png' height='100' width='100'></a>" +
              "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes 
                    +"><img class='movieLinkIcon' src='assets/images/rotten.png' height='100' width='100'></a>" +
              "<a target='_blank'  title='Metacritic'  href=" + metaCritic +"><img class='movieLinkIcon' src='assets/images/Metacritic.png' height='100' width='100'></a>" +
              "<a target='_blank' title='Facebook' href=" + facebook + "><img class='movieLinkIcon' src='assets/images/facebook.png' height='100' width='100'>" +
              "<a target='_blank' title='Wikipedia' href=" + wikipedia + "><img class='movieLinkIcon' src='assets/images/wikipedia.png' height='100' width='100'></a>" + "</div>"


          var descCast = "<div id='descCast' class='col s12'><h1 class='watch'> Cast </h1><div class='castResults'></div></div>"   

          var descViews = "<div id='descViews' class='col s12'>" + "<h1 class='watch'> Rent or Buy </h1><div class='buyResults'></div>" + "<br>" +
                        "<h1 class='watch'> Subscription Services </h1><div class='streamResults'></div>" + "</div>"

          var description = "<div class='movieOverview z-depth-5 hidden row'>" + "<div class='col s12'>" + "<ul class='tabs'>" + 
                                "<li class='tab col s3'><a href='#descHead'>Main</a></li>" +
                                "<li class='tab col s3'><a href='#descViews'>Watch</a></li>" +
                                "<li class='tab col s3'><a href='#descCast'>Cast</a></li>" +
                                "<li class='tab col s3'><a href='#descLinks'>Links</a></li>" + "</ul>" + "</div>" +
                              descHead + descViews + descLinks + descCast + "</div>";

          movieResult = "<div class='movieContainer valign-wrapper'><img data-ref="+data.id+" class='movieResult z-depth-5' src=" + image + ">" + description + "</div>";
          
          $('.guidebox-search-results').append(movieResult);
          $('ul.tabs').tabs();          
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

  $(document).on('click','.searchCall', function(){
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

  $(document).on('click','.movieResult', function(event){
    //if(event.detail==1){
      $(this).addClass("activeCard");
      $(this).parent().find('.movieOverview').removeClass('hidden');
      $(this).parent().find('.movieOverview').hide();
      $('.movieResult').hide();
      $('.activeCard').show();
      $(this).animate({
            left: '130px'
        }, 2000);
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
    //}
  });

  $(document).on('click', '.activeCard', function(){
    $(this).removeClass('activeCard');
    $('.movieResult').show();
    $('.movieOverview').addClass('hidden');
  });

  //wait for a submit click
  //function watchSubmit(){
    //$('.guidebox-search-form').submit(function(event){
      //$('.guidebox-search-results').empty();
      //event.preventDefault();
      //var query = $(this).find('.guidebox-query').val();
      //getSearchDataFromApi(query, displaySearchData);
      //
    //});
  //}


});