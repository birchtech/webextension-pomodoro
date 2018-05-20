/* globals Settings, PomodoroTimer */

describe('PomodoroTimer', () => {
  const { expect } = chai;

  const min25 = 25 * 60 * 1000; // 25 min
  const min5 = 5 * 60 * 1000; // 5 min

  let settings;
  let timer;

  beforeEach(() => {
    settings = new Settings();
    settings.runningDuration = min25;
    settings.breakingDuration = min5;
    timer = new PomodoroTimer(settings);
  });

  describe('start()', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date());
      timer.onStatusChange = sinon.spy();
      timer.onTick = sinon.spy();
      timer.start();
    });

    afterEach(() => {
      timer.stop();
    });

    it('does not starts again while running', () => {
      const spy = sinon.spy(timer, 'startRunning');
      timer.start();
      expect(spy).to.have.been.callCount(0);
    });

    it('becomes active', () => {
      expect(timer.active).to.eql(true);
    });

    it('becomes running', () => {
      expect(timer.running).to.eql(true);
    });

    it('does not become breaking', () => {
      expect(timer.breaking).to.eql(false);
    });

    it('calls status change event handler', () => {
      const spy = timer.onStatusChange;
      expect(spy).to.have.been.callCount(1);
    });

    it('stops later', () => {
      timer.stopTicking(); // illegal but makes test faster

      clock.tick(min25);
      expect(timer.running).to.eql(false);
    });

    it('calls tick event listener many times', () => {
      clock.tick(1000);
      const spy = timer.onTick;
      expect(spy).to.have.been.callCount(11);
    });
  });
});
