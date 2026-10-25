const str: string = 'Hi';
const iterator = str[Symbol.iterator]();

console.log(iterator.next()); // { value: 'H', done: false }
console.log(iterator.next()); // { value: 'i', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
