const fs = require('fs');

describe('changeFlag', () => {
  let changeFlag;
  let getSaveFlag;
  let setSaveFlag;
  let setButton;

  beforeEach(() => {
    const code = fs.readFileSync('./global_temp.js', 'utf8');
    const testCode = code + `
      if (typeof module !== 'undefined') {
        module.exports = {
          changeFlag,
          getSaveFlag: () => saveFlag,
          setSaveFlag: (v) => saveFlag = v,
          setButton: (b) => button = b
        };
      }
    `;
    const m = { exports: {} };
    const fn = new Function('module', testCode);
    fn(m);

    changeFlag = m.exports.changeFlag;
    getSaveFlag = m.exports.getSaveFlag;
    setSaveFlag = m.exports.setSaveFlag;
    setButton = m.exports.setButton;
  });

  test('should update button text to "Unmark Locations" and set saveFlag to true when initially false', () => {
    const buttonMock = {
      html: jest.fn()
    };
    setButton(buttonMock);
    setSaveFlag(false);

    changeFlag();

    expect(buttonMock.html).toHaveBeenCalledWith('Unmark Locations');
    expect(getSaveFlag()).toBe(true);
  });

  test('should update button text to "Mark Locations" and set saveFlag to false when initially true', () => {
    const buttonMock = {
      html: jest.fn()
    };
    setButton(buttonMock);
    setSaveFlag(true);

    changeFlag();

    expect(buttonMock.html).toHaveBeenCalledWith('Mark Locations');
    expect(getSaveFlag()).toBe(false);
  });
});
