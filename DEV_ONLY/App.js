// moment
import {deepEqual} from 'fast-equals';

import {
  defaultsTo, is, match, matchAll, not
} from '../src';

const findMatch = matchAll(
  is('stuff').then((value) => console.log(value)),
  is(/foo/).then('is foo'),
  not('quiz').then((value) => console.log(`${value} is not quiz`) || 'quiz result'),
  is((value) => value.length === 4).then((value) => console.log(`${value} is 4 letters long`))
);

findMatch('stuff');
console.log('match found', findMatch('foo bar baz'));
findMatch('bar');
findMatch('quiz');

const isEqualTo = (compareValue) => is((value) => deepEqual(value, compareValue));
const isEven = is((value) => value % 2 === 0);

const findMatch2 = match(
  is('foo').then(() => console.log('is foo')),
  isEven.then((value) => console.log(`${value} is an even number`))
);

findMatch2('foo');
findMatch2('bar');
findMatch2(8);

const findMatch3 = match(
  isEqualTo({foo: 'bar'}).then(() => console.log('deep equal works!')),
  isEven.then((value) => console.log(`${value} is divisible by two`)),
  defaultsTo((value) => console.log(`${value} is not even`))
);

findMatch3(10);
findMatch3(7);
findMatch3({foo: 'bar'});

const div = document.createElement('div');

div.textContent = 'Check the console.';

document.body.appendChild(div);
