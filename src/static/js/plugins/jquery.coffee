# Alias for setTimeout that reorders parameters to look neater in CoffeeScript
delay = (ms, cb) -> setTimeout cb, ms
# This next line just to prevent the app exiting in case you want to use this as a demo
delay 1000, ->
  console.log 'App exiting naturally'