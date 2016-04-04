/**
 * Add custom settings to Jasmine.
 */

/*globals jasmine*/

jasmine.VERBOSE = true;

require('jasmine-reporters');

var reporter = new jasmine.JUnitXmlReporter("log/");
jasmine.getEnv().addReporter(reporter);

// Enable Teamcity Reporter if a Teamcity environment is detected
if (process.env.TEAMCITY_VERSION) {
    var teamcity = new jasmine.TeamcityReporter();
    jasmine.getEnv().addReporter(teamcity);
}
