var a = 1;
const b = 2;
let c;

try {
  console.log(b);
  console.log(c);
} catch {}

function foo(arg) {
  if (arg === 3) return;

  console.log(arg);
  foo(arg + 1);
}

foo(1);
