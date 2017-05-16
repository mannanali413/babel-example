# babel-example
Understanding *Abstract Symbol Tree* **(AST)** by writing a simple plugin

The examples illustrated here are borrowed from [Sitepoint Tutorial on creating Babel Plugin](https://www.sitepoint.com/understanding-asts-building-babel-plugin/)

For someone who would want to understand the project they can clone the repo.

After cloning the repo, run

* `npm install`
* `node run.js test/case.ms`

## TODO's

- [x] Build a plugin which allows for the following operation
```javascript
2 | double | square

// would become

square(double(2))
```

- [x] Use `**` for exponentiation
```javascript

2 ** 3

// will return

Math.pow(2,3)
```
