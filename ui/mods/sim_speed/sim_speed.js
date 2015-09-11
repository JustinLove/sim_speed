(function() {
  var now = function() { return new Date().getTime() }
  var previousSimTime = 0
  var previousUITime = now()
  var simSamples = []
  var uiSamples = []
  model.simSpeed = ko.observable(1)

  var base_time = handlers.time
  handlers.time = function(payload) {
    base_time(payload)

    var simStep = (payload.end_time - previousSimTime) * 1000
    previousSimTime = payload.end_time

    if (simStep == 0) {
      return
    }

    var t = now()
    uiStep = t - previousUITime
    previousUITime = t

    simSamples.unshift(simStep)
    uiSamples.unshift(uiStep)
  }

  var sum = function(a, b) {return a + b}
  var average = function(samples) {
    return samples.reduce(sum, 0) / samples.length
  }
  var summarize = function() {
    model.simSpeed(average(simSamples) / average(uiSamples))
    simSamples.splice(20)
    uiSamples.splice(20)
  }

  var tick = function() {
    summarize()
    setTimeout(tick, 1000)
  }
  tick()

  model.simSpeedDisplay = ko.computed(function() {
    return (100*model.simSpeed()).toFixed(0) + '%'
  })
  $('.div_ingame_timer').after('<div class="div_sim_speed" data-bind="text: simSpeedDisplay">100%</div>')
})()
