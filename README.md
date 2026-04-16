# FC Media Player
A Media player that can be used to easily organize your favorite video media and save all of your watch data.

## Features

### Show Info
* Show title, synopsis, and cover
* Separate into seasons for easier access
* Episode names
* Easy access to specific episodes
* Sort shows into categories
* recentlyUpdated  section to put most recent additions front and center
### Video Playback
* PlayerJS advanced video player
* mediaSession API Compatability for easy control of content
* Episode selector on video page for easy bingibility
### Data
* Continue watching to get right back where you left off
* History page to go back to a specific episodes you were watching
* Download and upload your historyData to JSON for easy transfer across browsers/devices
* Quick access on showInfo page to jump right back into the episode you left off
* Data for each episode stored so you can pick up where you left off when selecting a specific video
* Customizable endEpisode breakpoint in main script to specify timing to reset current time on content
* Season last watched will be auto-selected when opening a show's info page

## Usage
- ### Customize data.js with your show's info.
    Add all of your show data into this file for use inside of the app

	#### Structure:

		

		const {showIdentifier} = {
		        "title": "{showTitle}",
		        "showIdentifier": "{showIdentifier}",
		        "seasonCount": {seasonCount},
		        "totalEpisodes": {totalEpisodes},
		        "synopsis": "{synopsis}",
		        // For Each Season
		        "S{seasonNumber}": {
		    	    "title": "{seasonTitle}",
		    	    "cover": "{seasonCoverLink}",
		    	    "EpCount": {seasonEpisodeCount},
		    	    "files": [episodeLinkArray],
		    	    "epNames": [episodeNameArray]
		    	 }
		    }
		    
		const showsToExportNew = {
			"{showIdentifier}": {showObject},
			// Add all shows in this object
		}

		const categories = {
			"${categoryName}": {
				"updateOrder": [{updateOrderArray}]
			}
		}

		const recentlyUpdated = [{showObjectArray}];
		
		

	* **showIndentifier**: the identifier you give for easy access to show
	* **showTitle**: the title of the show,
	* **seasonCount**: total seasons in show,
	* **totalEpisodes**: the total amount of episodes across all seasons
	* **synopsis**: description of show (can leave as a blank string)
	* **seasonNumber**: the number for the given season
	* **seasonTitle**: The title of the season
	* **seasonCoverLink**: the image file link to the season's cover
	* **EpCount**: the total number of episodes in the given season
	* **episodeLinkArray**: put the file links to the episodes in order
	* **episodeNameArray**: put the names to the episodes in order
	* **showsToExportNew**: shows that you want to add to the app go here
	* **showObject**: the reference to the object for your show
	* **recentlyUpdated**: put all shows you want to be pushed to the recently updated section here
	* **showObjectArray**: put the object references in this array for the shows you want to push to recentlyUpdated 
	* **categories**: a way to sort your shows into seperate categories
		> NOTE: recommended to make an "All" category so not every show is filtered, making at least one category is required to display
	* **categoryName**: The name of your specific category
	* **updateOrderArray**: Put all of the shows that fit into the category in order of newest show first (used for sorting)

* ### Change when episodes mark as complete
	

	  const finishEpisodeInterval = {timeLeftSeconds};
	* **finishEpisodeInterval**: the timing in seconds left in the video where the video registers as completed
	* **timeLeftSeconds**: the amount of seconds left in the video

* ### (Optional) Use imageBase64.js for easier access to image files
	

	  const imageBase64 = {
		  "{showIdentifier}": "{imageBase64Data}",
		  // Add any more data
	  }
	#### Usage:
		

	  imageBase64["{showIdentifier}"]
	
	* **imageBase64**: the object to place image data for simpler access to image data
	* **showIdentifier**: the identifier you gave for the show data in data.js
	* **imageBase64Data**: your image's base64 data (if you don't have it look up an image to base64 converter online)
