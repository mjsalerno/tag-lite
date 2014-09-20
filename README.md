# Unhackathon - Localized Image Tagging

## Concept
Facebook like image tagging without storing on the cloud. Local node server running on local machine. Images hosted on local machine or remote storage (NAS/etc).

## Installation

1. Clone this repository
	* `git clone git@github.com:mjsalerno/Unhackathon.git`
2. Install nodejs, npm, and bower
	* `sudo apt-get install nodejs`
	* `sudo apt-get install npm`
    * `npm install -g bower`
3. Install dependencies
	* `npm install`
4. Install polymer
    * `cd public`
    * `bower init`
    * `bower install --save Polymer/polymer` 
5. Configure settings by editing config.js
6. Run the server and navigate to http://localhost:port
	* `sudo node server.js`

## Credits
Things Mike, Paul, and Scott did at the Unhackathon. (Shane reneged)


