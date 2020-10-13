
export default class ErrorMessage{
  line:number;
  position:number;
  message:string;
  constructor(line:number,position:number,message:string){
    this.line = line;
    this.position = position;
    this.message = message;
  }
  print(){
    if(this.line!=-1)
      return `${this.message} at line:${this.line}, position:${this.position}`;
    return this.message;
  }
}