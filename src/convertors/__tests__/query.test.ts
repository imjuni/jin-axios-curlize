import mergeQuerytstringParams from '#convertors/mergeQuerystringParams';
import generateQuerystring from '#generators/generateQuerystring';
import encodeQuerystring from '#tools/encodeQuerystring';

describe('generate-querystring', () => {
  it('empty-querystring', () => {
    const url = new URL('https://localhost:1234');

    const qs = generateQuerystring(url, { prettify: true });

    expect(qs).toEqual('');
  });

  it('array-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&ability=${encodeURIComponent('supersonic flight')}`;
    const url = new URL(e);

    const qs = generateQuerystring(url, { prettify: true });

    expect(qs).toEqual('?name=ironman&ability=energy%20repulsor&ability=supersonic%20flight');
  });

  it('replacer-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const qs = generateQuerystring(url, {
      prettify: true,
      replacer: {
        querystring: (sp) => {
          const next = new URLSearchParams(sp);
          next.set('tid', '11111111-2222-43DA-8833-D0A7FF05D17C');
          return encodeQuerystring(next);
        },
      },
    });

    expect(qs).toEqual(
      '?name=ironman&ability=energy%20repulsor&tid=11111111-2222-43DA-8833-D0A7FF05D17C',
    );
  });

  it('replacer-querystring + exception', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const qs = generateQuerystring(url, {
      prettify: true,
      replacer: {
        querystring: (sp) => {
          const next = new URLSearchParams(sp);

          if (Array.from(next.keys()).length > 0) {
            throw new Error('unknown error');
          }

          return next;
        },
      },
    });

    expect(qs).toEqual(
      '?name=ironman&ability=energy repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C',
    );
  });
});

describe('mergeQuerytstringParams', () => {
  it('pass - with object', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const nextUrl = mergeQuerytstringParams(url, { team: 'Avengers', age: undefined });

    expect(nextUrl.href).toEqual(
      `https://localhost:1234/?team=Avengers&name=ironman&ability=energy+repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`,
    );
  });

  it('pass - with object, array', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const nextUrl = mergeQuerytstringParams(url, {
      team: ['Avengers', 'S.H.I.E.L.D.'],
      age: undefined,
    });

    expect(nextUrl.href).toEqual(
      `https://localhost:1234/?team=Avengers&team=S.H.I.E.L.D.&name=ironman&ability=energy+repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`,
    );
  });

  it('pass - with URLSearchParams', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const addSp = new URLSearchParams();
    addSp.append('team', 'Avengers');
    addSp.append('team', 'S.H.I.E.L.D.');

    console.log(addSp.entries());

    const nextUrl = mergeQuerytstringParams(url, addSp);

    console.log(nextUrl.href);

    expect(nextUrl.href).toEqual(
      `https://localhost:1234/?team=Avengers&team=S.H.I.E.L.D.&name=ironman&ability=energy+repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`,
    );
  });

  it('pass - not merge', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=energy repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const nextUrl = mergeQuerytstringParams(url, [1]);

    console.log(nextUrl.href);

    expect(nextUrl.href).toEqual(
      `https://localhost:1234/?name=ironman&ability=energy%20repulsor&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`,
    );
  });
});
