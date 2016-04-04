# TTrack

A Time Tracking application. Needs a Postgres Database

## Development

This section explains how to develop the TTrack application.

### Getting Started

To start developing you have to run the app in dev mode.
Prefer to do this locally which will be more efficient.

```
# don't forget migrations!
$ db-migrate up

# start the ttrack server (port 8080)
$ npm start

# start the webpack dev server
$ npm run dev

# open the app
$ open http://localhost:8080
```

The webpack dev server watches the sources and serves the built JS and CSS with hot reloading enabled.
The ttrack server serves the main index.html and the rest API. It requests JS and CSS from the webpack dev server.
