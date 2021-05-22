import State from "./State";

class NoneState extends State {
  public choose() {
    console.log('.choose()');
  }

  public edit() {
    console.log('.edit()');
  }

  public cancel() {
    console.log('.cancel()');
  }
}

export default NoneState;
