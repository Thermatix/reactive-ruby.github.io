var TIMER_COMPONENT = `
class Ticker < React::Component::Base

  before_mount do
    state.ticks! 0
    @timer = every(1) {state.ticks! state.ticks+1}
  end

  before_unmount do
    @timer.stop
  end

  def render
    div {"Seconds Elapsed: #{state.ticks}"}
  end

end

Element['#timer-target'].render { Ticker() }
`;

React.render(
  <ReactPlayground codeText={TIMER_COMPONENT} elementId="timer-target" />,
  document.getElementById('timerExample')
);
