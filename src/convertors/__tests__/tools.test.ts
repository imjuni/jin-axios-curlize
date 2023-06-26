import getIndent from '#tools/getIndent';
import getNewline from '#tools/getNewline';

describe('getIndent', () => {
  it('2-space', () => {
    const indent = getIndent({ prettify: true });
    expect(indent).toEqual('  ');
  });

  it('2-space', () => {
    const indent = getIndent({ prettify: true, indent: 3 });
    expect(indent).toEqual('   ');
  });

  it('no-indent', () => {
    const indent = getIndent({ prettify: false });
    expect(indent).toEqual('');
  });
});

describe('get-newline', () => {
  it('newline', () => {
    const nl = getNewline({ prettify: true });
    expect(nl).toEqual(' \\\n');
  });

  it('space', () => {
    const nl = getNewline({ prettify: false });
    expect(nl).toEqual(' ');
  });
});
