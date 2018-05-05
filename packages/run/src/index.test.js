describe('Run component', () => {
  let Run;

  afterEach(() => {
    jest.resetModules();
  });

  describe('#execute', () => {
    let execMock;

    describe('when command is successful', () => {
      beforeEach(() => {
        execMock = jest.fn(() => Promise.resolve());
        jest.doMock('./exec', () => execMock);

        Run = require('.').default;
      });

      it('calls exec with correct command', async () => {
        await Run.execute({ command: 'yarn' });

        expect(execMock).toHaveBeenCalledWith('yarn');
      });

      it('completes successfully', () => {
        expect(Run.execute({ command: 'yarn' })).resolves.toBeUndefined();
      });
    });

    describe('when command is unsuccessful', () => {
      let consoleSpy;

      beforeEach(() => {
        execMock = jest.fn(() =>
          Promise.reject(new Error('The command failed.')),
        );
        jest.doMock('./exec', () => execMock);

        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        Run = require('.').default;
      });

      afterEach(() => {
        consoleSpy.mockRestore();
      });

      it('throws an error', () => {
        expect(
          Run.execute({
            command: 'yarn',
          }),
        ).rejects.toThrow('The command failed.');
      });

      it('shows a console log for the user', async () => {
        try {
          await Run.execute({ command: 'yarn' });
        } catch (err) {
          //empty
        }

        expect(consoleSpy).toHaveBeenCalledWith('The command failed.');
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      Run = require('.').default;
    });

    it('does not throw an error when command is a string', () => {
      expect(() => Run.validate({ command: 'yarn' })).not.toThrow();
    });

    it('throws an error when command is not a string', () => {
      expect(() => Run.validate({ command: 1 })).toThrow();
    });
  });
});
