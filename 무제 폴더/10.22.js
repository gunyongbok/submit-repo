class Employee {
  constructor(
    private _name : String,
    private _age : Number,
    private _job : String,
  )

  get empName() {
    return this._name;
  }

  set empName(val : string) {
    this._name = val;
  }

  printEMp = (): void => {
    console.log(_name, _age, _job);
  };
}

let employee1 = new Employee("kim", 20, "개발자");
employee1._name = "lee";
employee1.printEMp();
