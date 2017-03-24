$(document).ready(function() {
  var omdbEndpoint = "https://www.omdbapi.com/?i=";
  var guideboxApiKey = '5de31aceff0f33007097cdd38a781d9ce2c97579'; //back up key bb5916942e7197cb1bbd1ba21afebb7bb1b57a51
  var guideboxEndpoint = 'http://api-public.guidebox.com/v2/us/' + guideboxApiKey + '/search/movie/title/';

  //An Api call for our current Keys quota
  var quota = $.getJSON('http://api-public.guidebox.com/v2/us/' + guideboxApiKey + '/quota', function(data){
    console.log(data);  //this helps us keep track of our Search limit. Each Key has 15K per month.
  });

  var imdbEndpoint = "https://www.imdb.com/title/";
  var rottenTomEndpoint = "https://www.rottentomatoes.com/m/";
  var facebookEndpoint = "https://www.facebook.com/";
  var wikipediaEndpoint = "https://en.wikipedia.org/?curid=";

  //variable for the NYT movie revie API I would like to add in
  var nytMovieKey = "20ef8a21506e4a07854339d77f1c8ac2";
  var nytMovieEndpoint = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
  
  //hide the samll logo on startup
  $("#logoSmall").hide();
    
  //function to run the API call for movies matching the search term give
  function searchGuideboxAPI(searchTerm, callback) {
      var query = guideboxEndpoint + searchTerm ;
      $.getJSON(query, callback);
  };

  //function to grab info from OMDB API though we still need to plug some data to the DOM
  function getDataFromOMDB(imdbLink) {
    var search = omdbEndpoint + imdbLink;
    $.getJSON(search, function(omdb){

    });
  };

  //function to grab all the available subsription streaming sources of a movie
  function streamingSources(streamData) {
    if (streamData.length){                   //if there are results in subscriptions then it runs the code below
      for(i=0; i<streamData.length; i++) {    //run through the full length of results
        //append each result as a button giving each btn an href of the link supplied from the API call
        $(".streamResults").append("<a target='_blank' href="+streamData[i].link
          +"><button class='streamLink btn waves-effect waves-light'>"+streamData[i].display_name+"</button></a>");
      }
    } else {                                  //if there are no results in subscriptions then it runs the code below
        $(".streamResults").append("<p>none avaialable</p>");  //append 'none available' to the Subscription results div
    }
  }

  //function to call the API for Cast members
  function showCast(cast) {
    for(i=0; i<15; i++) {  //limt the loop to 15 returns as some of the lists are quite long
      //append each cast member as a button with a data attr of their ID # used in the API call to find their other movies
      $(".castResults").append("<button class='castMem btn waves-effect waves-light submit' data-castID='" + 
        cast[i].id + "'>"+cast[i].name+"</button>");
    }
  }

  //function to find the movies based on a cast members id #
  function castingCall(personID, callback) {
    var castQuery = 'http://api-public.guidebox.com/v2/person/' + personID + '/credits?api_key=' 
      + guideboxApiKey + '&role=cast';          //personID will be the cast members id # passed in from their data attr
    console.log("castQuery is " + castQuery)
      $.getJSON(castQuery, callback);
  };

  //function to run the castingCall function when a cast btn is clicked
  $(document).on('click','.castMem', function(){  //when an element with the class castMem is clicked
    $('.guidebox-search-results').empty();        //empty the previous search results
    var castData = $(this).attr('data-castID');   //castData becomes the data-castID of the btn clicked
      castingCall(castData, displaySearchData);   //preform Casting call passing in castData then running displaySearchData function
    });

  //function to grab the streaming soruces for purchase
  function rentBuySources(purchase) {
    if (purchase.length){             //if there are results in purchase.length then run the code below
      for(i=0; i<6; i++) {            //limit the returns to 6, after 6 the source are not popular.
        //append the .buyResults div with buttons of the sources and hrefs of their links
        $(".buyResults").append("<a target='_blank' href="+purchase[i].link
          +"><button class='streamLink btn waves-effect waves-light'>"+purchase[i].display_name+"</button></a>");
      }
    } else {                          //if there are no results in purchase.length append 'no results'
        $(".buyResults").append("<p>none avaialable</p>");
    }
  }

  //Function to display the results of movies from an API call
  function displaySearchData(data){
  var apisDefaultImg = 'http://static-api.guidebox.com/misc/default_movie_240x342.jpg';  //the link given when a movie has no unique poster
  if (data.results.length) {              //if data returns run the code below
    $(".landing").hide();                 //hide the big logo & seach form
    $("#logoSmall").fadeIn("slow");       //fade in the small logo
    data.results.forEach(function(item) { //do the following for each movie result returned
      var image = item.poster_240x342;    //var image is the poster for each result
      if (image !== apisDefaultImg) {     //if image is not default then proceed (ignore results with no poster)
        //building a new url to use for Ajax call for more details on the movie
        var trailerLinksURL = 'http://api-public.guidebox.com/v2/US/' + guideboxApiKey + '/movie/' + item.id;
        //grab individual elements from movies to display in dom
        $.getJSON(trailerLinksURL, function(data){
          var movieResult = '';                     //set movieResult as a string
          var rated = data.rating;                  //set rated as the movies rating
          var genre = data.genres[0].title;         //set genre primary index in data.genre
          var movieDescription = data.overview;     //set movieDescription as the data in overview
          var imdbLink = imdbEndpoint + data.imdb;  //imdbLink becomes the url for that movies imdb page

          //console.log("___OMDB link for " + data.title+"___________")
          //console.log(omdbEndpoint + data.imdb);
          console.log("___Guidebox link for " + data.title+"___________")
          console.log(trailerLinksURL);

          //getDataFromOMDB(data.imdb);             //a call for OMDB data once we figure what we want to pull

          //build out variables for the various links
          var rottenTomatoes = rottenTomEndpoint + data.rottentomatoes; 
          var commonSenseMedia = data.common_sense_media;
          var metaCritic = data.metacritic;
          var trailerVideo = data.trailers.web[0].embed;          
          var watchLinks = data.purchase_web_sources[0].link;
          var facebook = facebookEndpoint + data.social.facebook.facebook_id;
          var wikipedia = wikipediaEndpoint + data.wikipedia_id;

          //variable to populate the Main section of the movieOverview section
          var descHead =  
            "<div id='descHead' class='col s12'>" + 
              "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" 
                 + commonSenseMedia + " ><img src='assets/images/commonsense.png' height='40' width='40'></a></h3>" + "<br>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>" +
              "<p class='movieText'>" + movieDescription + "</p><br>" + 
            "</div>";

          //variable to populate the Links section of the movieOverview section
          var descLinks = 
            "<div id='descLinks' class='movieLinks col s12'>" +
              "<a href=" + trailerVideo + "rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe' id='trailerLink'>" +
              "<img class='movieLinkIcon' src='assets/images/play_trailer.png' height='100' width='100'></a>" +
              "<a target='_blank' title='IMDB' href=" + imdbLink + 
              "><img class='movieLinkIcon' src='assets/images/imdb.png' height='100' width='100'></a>" +
              "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes +
                  "><img class='movieLinkIcon' src='assets/images/rotten.png' height='100' width='100'></a>" +
              "<a target='_blank'  title='Metacritic'  href=" + metaCritic +
                  "><img class='movieLinkIcon' src='assets/images/Metacritic.png' height='100' width='100'></a>" +
              "<a target='_blank' title='Facebook' href=" + facebook + 
                  "><img class='movieLinkIcon' src='assets/images/facebook.png' height='100' width='100'></a>" +
              "<a target='_blank' title='Wikipedia' href=" + wikipedia + 
                  "><img class='movieLinkIcon' src='assets/images/wikipedia.png' height='100' width='100'></a>" + 
            "</div>";

          //variable to populate the Cast section of the movieOverview section
          var descCast = 
            "<div id='descCast' class='col s12'><h1 class='watch'> Cast </h1><div class='castResults'></div></div>";  

          //variable to populate the Watch section of the movieOverview section
          var descViews = 
            "<div id='descViews' class='col s12'>" + 
              "<h1 class='watch'> Rent or Buy </h1><div class='buyResults'></div>" + "<br>" +
              "<h1 class='watch'> Subscription Services </h1><div class='streamResults'></div>" + 
            "</div>";

          //variable to build out the sectriopns of the movieOverview div using Materialize Tabs
          var description = 
            "<div class='movieOverview z-depth-5 hidden row'>" + "<div class='col s12'>" + "<ul class='tabs'>" + 
              "<li class='tab col s3'><a href='#descHead'>Main</a></li>" +
              "<li class='tab col s3'><a href='#descViews'>Watch</a></li>" +
              "<li class='tab col s3'><a href='#descCast'>Cast</a></li>" +
              "<li class='tab col s3'><a href='#descLinks'>Links</a></li>" + "</ul>" + "</div>" +
                  descHead + descViews + descLinks + descCast + 
            "</div>";
          //have the variable movieResult build out the whole movieContainer div
          movieResult = 
            "<div class='movieContainer valign-wrapper'><img data-ref="+data.id
              +" class='movieResult z-depth-5' src=" + image + ">" + description + "</div>";
          
          $('.guidebox-search-results').append(movieResult);    //append the the movieResult in the results area of the DOM
          $('.guidebox-search-results').find('ul.tabs').tabs(); //used to initialize Materialize tabns since they are added dynamically
                    
        });
      }
    });
  } else {  //if the initial search has no data run append this error message to the results div
    var noResults = '<p><i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i>Sorry, we could not find anything with that term. <br>Please type a new term.</p>';
    $('.guidebox-search-results').append(noResults);
    }
  };

  //function to run on a submit (clicking button or hitting enter)
  function runOnSubmit(){
    $('.guidebox-search-form').submit(function(event){      //when search form has a submit
      $('.guidebox-search-results').empty();                //empty the previous results
      event.preventDefault();                               //prevent submit from reloading the page
      var query = $(this).find('.guidebox-query').val();    //grab the users search term
      searchGuideboxAPI(query, displaySearchData);          //call the function to search movies passing in the users term then running displaySearchData
    });
  }  

  //This block Im working on to try and prevent a user double clicking submit and gettting multiple sets of results
  /*$('.btnSubmit').click(function(event) {
    $(this).attr('disabled', true);  // disable button temporarily
    $.when(runOnSubmit()).then(function(event) {
        $(this).attr('disabled', false); // enable button after method was successful.
    });
  });*/

  //This click handler will bring back the search bar when the icon or small logo get clicked
  $(document).on('click','.searchCall', function(){
    $('.guidebox-search-results').empty();            //emptys results on screen
    $("#logoSmall").hide();                           //hides the small logo
    $(".landing").fadeIn("slow");                     //fades in the big logo and search form
  });

  //anonymous function calling runOnSubmit
  $(function(){    
    runOnSubmit();
  });

  //anonymous function calling the jquery plugin validate and setting the rules
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

  //This click handler will show the movieOverview display and populate some data
  $(document).on('click','.movieResult', function(event){               //wheneve the .movieResult card is clicked
      $(this).addClass("activeCard");                                   //adds the class .activeCard
      $(this).parent().find('.movieOverview').removeClass('hidden');    //removes the class hidden from the MovieOverview & it shows
      $(this).parent().find('.movieOverview').hide();                   //keeps the Overview hidden   
      $('.movieResult').hide();
      $('.activeCard').show();                                          //Shows the poster with the new class activeCard
      $(this).animate({                                                 //animates the poster left 130px over 2 seconds
            left: '130px'
        }, 2000);
      $(this).parent().find('.movieOverview').show(1000);               //shows the overview after 1 second
      var cardURL = 'https://api-public.guidebox.com/v1.43/US/'         //build a url for a new ajax call
        + guideboxApiKey + '/movie/' + $(this).data("ref");
      $.getJSON(cardURL, function(data){                                //Ajax call based on the movie card ID #
        $(".streamResults").empty();                                    //emptys any previous results in .streamResults
        $(".castResults").empty();                                      //emptys any previous results in .castResults
        $(".buyResults").empty();                                       //emptys any previous results in .buyResults
        streamingSources(data.subscription_web_sources);                //call function to grab this moives subscriptions     
        showCast(data.cast);                                            //call function to grab this moives cast 
        rentBuySources(data.purchase_web_sources);                      //call function to grab this moives rent Buy options 
      });
  });

  //this click handler will hide the overview when clicking a movie card that has the class activeCard
  $(document).on('click', '.activeCard', function(){
    $(this).removeClass('activeCard');                //remove the activeCard class
    $('.movieResult').show();                         //show other movie results that were hidden
    $('.movieOverview').addClass('hidden');           // add a class to hide the overview again
  }); 


});